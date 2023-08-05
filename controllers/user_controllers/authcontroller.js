
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const pool = require("../../config/db");
const {v4 : uuidv4} = require("uuid");

const saltRounds = 10;

const registerUser = async (req,res) => {
    try {
        const {email,password,role,phone_number,name,id_card_img,address,profile_pic_img} = req.body;
        console.log(role)
        const user = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
        if (user.rowCount===1) {
          return res.status(201).send({
            message : "This Email was Already Used"
          });
        }
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
          
           const user_id = uuidv4();
           let access,status;
           if(role) {
              access = role
           } else {
            access = "tutor";
           } 
           if(role==="tutor") {
             status="pending"
           } else  {
            status="approved"
          }
          const create_user = await pool.query(`INSERT into users 
          (user_id,email,password,status,role,phone_number,name,id_card,address,profile_pic) 
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [user_id,email,hash,status,access,phone_number,name,id_card_img,address,profile_pic_img])
            .then((user) => {
              res.send({
                success: true,
                message: "User is created Successfully",
                user : {
                  user_id,
                  email
                }
              });
            })
            .catch((error) => {
              res.send({
                success: false,
                message: "User is not created",
                error: error,
              });
            });
         });


      } catch (error) {
        res.status(500).send(error.message);
      }
}

const loginUser = async (req,res) => {
  const {email,password,role} = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email=$1 AND role=$2",[email,role]);
  if (user.rowCount===0 | user?.rows[0]?.status === "pending") {
    return res.status(201).send({
      success: false,
      message: "User is not found",
    });
  }

  if (!bcrypt.compareSync(password, user.rows[0]?.password)) {
    return res.status(201).send({
      success: false,
      message: "Incorrect password",
    });
  }

  const payload = {
    id: user.rows[0].user_id,
    name: user.rows[0].name,
    role : user.rows[0].role
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "2d",
  });


  const create_user = await pool.query("INSERT into tokens (token) VALUES ($1)",
          [token])
  
  .then((result)=> {
    return res.status(200).send({
      success: true,
      userinfo:{
        name:user.rows[0].name,
        user_id:user.rows[0].user_id,
        role : user.rows[0].role
      },
      message: "User is logged in successfully",
      token: "Bearer " + token,
    });
  })

}

const logout = async (req,res) => {
   let {token} = req.body
  token = token.split(' ')[1];
  if(token) { 
  const deleteToken = await pool.query("DELETE  FROM tokens WHERE token=$1",[token])
  .then((result)=> {
    return res.send({
      success: true,
      message: "Token has been deleted successfully",
    })
  })

  .catch((error) => {
    res.send({
      success: false,
      message: "Something went wrong!!",
      error: error,
    });
  });
  }

  else {
    return res.send({result : "please provide valid token"});
  }

}

//middleware

//check admin middleware
const isAdmin = async (req,resp,next) => {

  let token = req.headers['authorization'];

  if(token) {
    token = token.split(' ')[1];
    const checkToken = await pool.query("SELECT * FROM tokens WHERE token=$1",[token]);

    if(checkToken.rowCount===0) {
      return resp.send({result : "please provide valid token"});
    }

    else  { 
    jwt.verify(token,process.env.SECRET_KEY,(err,valid)=> {
      if(err) {
        resp.send({result : "please provide valid token"});
      } else {
          let decode;
          decode = jwt.decode(token);
          req.info = decode;    
           if(decode.role ==='admin') { 
              next();
           } else {
                resp.send({
                  message : "admin not verified"
                })
           }
      }
    
    })
  }
  } else {
    resp.send({result : "please add token with header"});
  }
}



//check guardian middleware
const isGuardian = async (req,resp,next) => {

  let token = req.headers['authorization'];
  if(token) {
    token = token.split(' ')[1];
    const checkToken = await pool.query("SELECT * FROM tokens WHERE token=$1",[token]);
    
    if(checkToken.rowCount===0) {
      return resp.send({result : "please provide valid token"});
    }

    else  { 
    jwt.verify(token,process.env.SECRET_KEY,(err,valid)=> {
      if(err) {
        resp.send({result : "please provide valid token"});
      } else {
          let decode;
          decode = jwt.decode(token);
          req.info = decode;    
           if(decode.role ==='guardian') { 
              next();
           } else {
                resp.send({
                  message : "guardian not verified"
                })
           }
      }
    })
    }
  }
   else {
    resp.send({result : "please add token with header"});
  }
}

const isTutor = async (req,resp,next) => {

  let token = req.headers['authorization'];
  if(token) {
    token = token.split(' ')[1];
    const checkToken = await pool.query("SELECT * FROM tokens WHERE token=$1",[token]);
    
    if(checkToken.rowCount===0) {
      return resp.send({result : "please provide valid token"});
    }

    else  { 
    jwt.verify(token,process.env.SECRET_KEY,(err,valid)=> {
      if(err) {
        resp.send({result : "please provide valid token"});
      } else {
          let decode;
          decode = jwt.decode(token);
          req.info = decode;    
           if(decode.role ==='tutor') { 
              next();
           } else {
                resp.send({
                  message : "guardian not verified"
                })
           }
      }
    })
    }
  }
   else {
    resp.send({result : "please add token with header"});
  }
}

//token verification from frontend side
const verifyTokenfrontend = (req,resp) => {
  let token = req.headers['authorization'];
  if(token) {
    token = token.split(' ')[1];
    jwt.verify(token,process.env.SECRET_KEY,(err,valid)=> {
      if(err) {
        resp.send({result : "please provide valid token"});
      } else {
          let decode;
          decode = jwt.decode(token);
          req.info = decode;    
           resp.send({
            result : "token is verified",
            id:decode.id,
            role : decode.role
          })
            
      }
    })

  } else {
    resp.send({result : "please add token with header"});
  }
}

module.exports = {registerUser,loginUser,isAdmin,isGuardian,isTutor,logout,verifyTokenfrontend}
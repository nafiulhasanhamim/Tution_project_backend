require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const pool = require("../../config/db");
const {v4 : uuidv4} = require("uuid");

const saltRounds = 10;

//getAllTutors
const getAllTutors = async (req,res) => {
    const allUsers = await pool.query("select user_id,name,email from users where role=$1 AND status=$2",["tutor","approved"])
    .then((user)=> {
        res.send({
            success: true,
            message: "Successfully fetched all Tutors",
            users : user.rows
          });
    })
    .catch((error) => {
        res.send({
          success: false,
          message: "Something went wrong!!",
          error: error,
        });
      });
}

//Tutor information for their profile 
const getAParticularTutor = async (req,res) => {
  const {tutor_id} = req.body;
  const allUsers = await pool.query(`select user_id,name,email,phone_number,address,profile_pic from users where role=$1 
  AND status=$2 AND user_id=$3
  `,["tutor","approved",tutor_id])
  .then((user)=> {
      res.send({
          success: true,
          message: "Successfully fetched",
          users : user.rows
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}

//Guardian information for their profile 
const getAParticularGuardian = async (req,res) => {
  const {guardian_id} = req.body;
  const allUsers = await pool.query(`select user_id,name,email,phone_number,address,profile_pic from users where role=$1 
  AND status=$2 AND user_id=$3
  `,["guardian","approved",guardian_id])
  .then((user)=> {
      res.send({
          success: true,
          message: "Successfully fetched",
          users : user.rows
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}

//updated tutor profile 
const updatedTutorProfile = async (req,res) => {
  const {user_id,name,address,profile_pic_img,phone_number} = req.body;
  console.log(req.body)
  const allUsers = await pool.query(`UPDATE users SET name=$1,phone_number=$2,address=$3,
  profile_pic=$4 WHERE role=$5 
  AND status=$6 AND user_id=$7
  `,[name,phone_number,address,profile_pic_img,"tutor","approved",user_id])
  .then((user)=> {
      res.send({
          success: true,
          message: "Information updated successfully",
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}

//updated guardian profile 
const updatedGuardianProfile = async (req,res) => {
  const {user_id,name,address,profile_pic_img,phone_number} = req.body;
  console.log(req.body)
  const allUsers = await pool.query(`UPDATE users SET name=$1,phone_number=$2,address=$3,
  profile_pic=$4 WHERE role=$5 
  AND status=$6 AND user_id=$7
  `,[name,phone_number,address,profile_pic_img,"guardian","approved",user_id])
  .then((user)=> {
      res.send({
          success: true,
          message: "Information updated successfully",
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}

//Recommended Tutors
const recommendedTutors = async (req,res) => {
  const allUsers = await pool.query(`  
  SELECT u.user_id,u.email,u.name, u.phone_number,u.id_card,u.profile_pic
  FROM users u
  LEFT JOIN (SELECT tutor_id,tution_id FROM assigned_tutions WHERE assigned_status='approved') as
  ast ON ast.tutor_id = u.user_id
  WHERE u.role='tutor' AND u.status='approved' AND ast.tution_id IS NULL;
  `)
  .then((user)=> {
      res.send({
          success: true,
          message: "Successfully fetched all recommended tutors",
          users : user.rows
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}

//getAllPendingTutors
const getAllPendingTutors = async (req,res) => {
    const allUsers = await pool.query("select user_id,name,email,phone_number,id_card from users where role=$1 AND status=$2",["tutor","pending"])
    .then((user)=> {
        res.send({
            success: true,
            message: "Successfully fetched all Pending Tutors",
            users : user.rows
          });
    })
    .catch((error) => {
        res.send({
          success: false,
          message: "Something went wrong!!",
          error: error,
        });
      });
}

//getAllApprovedTutors
const getAllApprovedTutors = async (req,res) => {
  const allUsers = await pool.query("select user_id,name,email,phone_number,id_card from users where role=$1 AND status=$2",["tutor","approved"])
  .then((user)=> {
      res.send({
          success: true,
          message: "Successfully fetched all approved Tutors",
          users : user.rows
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}

//getAllGuardians
const getAllGuardians = async (req,res) => {
    const allUsers = await pool.query("select user_id,name,email,phone_number from users where role=$1",["guardian"])
    .then((user)=> {
        res.send({
            success: true,
            message: "Successfully fetched all Guardians",
            users : user.rows
          });
    })
    .catch((error) => {
        res.send({
          success: false,
          message: "Something went wrong!!",
          error: error,
        });
      });
}

//approveTutor
const approveTutor = async (req,res) => {
    const {user_id} = req.body;
    const user = await pool.query("select user_id,name,email,role,status from users where user_id=$1",[user_id])
    if(user.rowCount===0 | user.rows[0].role!=="tutor"|user.rows[0].status!=="pending") {
        return res.status(400).send({
            message : "Something Went Wrong!!!"
          });
    }
    const updateStatus = await pool.query(`UPDATE users SET status=$1 WHERE user_id=$2`,["approved",user_id])

    .then((user)=> {
        res.send({
            success: true,
            message: "Tutor Approved Successfully",
          });
    })
    .catch((error) => {
        res.send({
          success: false,
          message: "Something went wrong!!",
          error: error,
        });
      });
}

//deleteTutor
const deleteTutor = async (req,res) => {
  const {user_id} = req.body;
  console.log(user_id)
  const updateStatus = await pool.query(`DELETE FROM users WHERE user_id=$1`,[user_id])
  .then((user)=> {
      res.send({
          success: true,
          message: "Tutor is Deleted Successfully",
        });
  })
  .catch((error) => {
      res.send({
        success: false,
        message: "Something went wrong!!",
        error: error,
      });
    });
}



module.exports = {getAllTutors,getAllPendingTutors,getAllApprovedTutors,getAllGuardians,approveTutor,
  getAParticularTutor,recommendedTutors,deleteTutor,updatedTutorProfile,getAParticularGuardian,updatedGuardianProfile}
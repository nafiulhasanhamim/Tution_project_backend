require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const pool = require("../../config/db");
const {v4 : uuidv4} = require("uuid");

const saltRounds = 10;

const addSubject = async (req,res) => {
    try {
        const {subject_name} = req.body;
        const subject_id = uuidv4();
        const result1 = await pool.query(`INSERT into subjects (subject_id,subject_name) 
        VALUES ($1,$2)`,
        [subject_id,subject_name])
        
        .then((subject)=> {
            res.send({
                success: true,
                message: "Subject has successfully been added",
              });
        })
        .catch((error) => {
            res.send({
              success: false,
              message: "Something went wrong!!",
              error: error,
            });
          });
        
      } catch (error) {
        res.status(500).send(error.message);
      }
}

const addLocation = async (req,res) => {
  try {
      const {location_name} = req.body;
      const location_id = uuidv4();
      const result1 = await pool.query(`INSERT into locations (location_id,location_name) 
      VALUES ($1,$2)`,
      [location_id,location_name])
      
      .then((location)=> {
          res.send({
              success: true,
              message: "Location has successfully been added",
            });
      })
      .catch((error) => {
          res.send({
            success: false,
            message: "Something went wrong!!",
            error: error,
          });
        });
      
    } catch (error) {
      res.status(500).send(error.message);
    }
}

const approvePost = async (req,res) => {
        const {tution_id} = req.body;
        const updateStatus = await pool.query(`UPDATE tution_posts SET tution_status=$1 WHERE tution_id=$2`,["approved",tution_id])
    
        .then((post)=> {
            res.send({
                success: true,
                message: "Post has been approved successfully",
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

const declinedPost = async (req,res) => {
    const {tution_id} = req.body;

    const declined = await pool.query(`UPDATE tution_posts SET tution_status=$1 WHERE tution_id=$2`,["declined",tution_id])

    .then((post)=> {
        res.send({
            success: true,
            message: "Post has been declined successfully",
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


const getAllPendingPost = async (req,res) => {

  const query = await pool.query(`
  
  SELECT tp.tution_id,
  l.location_name,tp.class as classname,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
  u.email,u.phone_number,u.name,
    COUNT(*) OVER () AS total_rows,
  STRING_AGG(s.subject_name, ', ') AS subject_name
  FROM tution_posts as tp 
  JOIN
  tution_subjects AS ts ON tp.tution_id = ts.tution_id
  JOIN subjects as s ON ts.subject_id = s.subject_id
  JOIN users as u ON tp.user_id = u.user_id
  JOIN locations as l ON tp.location_id=l.location_id
    WHERE tp.tution_status='pending'  
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,u.name,tp.tution_preference,tp.tution_type
  
  `)
  .then((post)=> {
      res.send({
          success: true,
          message: "All pending posts fetched successfully",
          posts : post.rows
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

const getAllApprovedPost = async (req,res) => {

  const query = await pool.query(`
  
  SELECT tp.tution_id,
  l.location_name,tp.class as classname,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
  u.email,u.phone_number,u.name,
    COUNT(*) OVER () AS total_rows,
  STRING_AGG(s.subject_name, ', ') AS subject_name
  FROM tution_posts as tp 
  JOIN
  tution_subjects AS ts ON tp.tution_id = ts.tution_id
  JOIN subjects as s ON ts.subject_id = s.subject_id
  JOIN users as u ON tp.user_id = u.user_id
  JOIN locations as l ON tp.location_id=l.location_id
    WHERE tp.tution_status='approved'  
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,u.name,tp.tution_preference,tp.tution_type
  
  `)
  .then((post)=> {
      res.send({
          success: true,
          message: "All approved posts fetched successfully",
          posts : post.rows
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

//Information about a particular tution

const infoAboutAParticularTution = async (req,res) => {
  const {tution_id} = req.body;
  const query = await pool.query(`
  SELECT tp.tution_id,
  l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
  u.email,u.phone_number,u.name,
    COUNT(*) OVER () AS total_rows,
  STRING_AGG(s.subject_name, ', ') AS subject_name
  FROM tution_posts as tp 
  JOIN
  tution_subjects AS ts ON tp.tution_id = ts.tution_id
  JOIN subjects as s ON ts.subject_id = s.subject_id
  JOIN users as u ON tp.user_id = u.user_id
  JOIN locations as l ON tp.location_id=l.location_id
    WHERE tp.tution_id=$1  
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,u.name,tp.tution_preference,tp.tution_type

  `,[tution_id])
  .then((post)=> {
      res.send({
          success: true,
          message: "Successfully fetched information about a particular tution",
          posts : post.rows
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

//Information about a particular tution

const getAllTutionInformation = async (req,res) => {
  const query = await pool.query(`
  SELECT tp.tution_id,
  l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
  u.email,u.phone_number,u.name,
    COUNT(*) OVER () AS total_rows,
  STRING_AGG(s.subject_name, ', ') AS subject_name
  FROM tution_posts as tp 
  JOIN
  tution_subjects AS ts ON tp.tution_id = ts.tution_id
  JOIN subjects as s ON ts.subject_id = s.subject_id
  JOIN users as u ON tp.user_id = u.user_id
  JOIN locations as l ON tp.location_id=l.location_id
    WHERE tp.tution_status='approved' OR tp.tution_status='pending'  
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,u.name,tp.tution_preference,tp.tution_type
  
  `)
  .then((post)=> {
      res.send({
          success: true,
          message: "Successfully fetched all tutions",
          posts : post.rows
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

//filtering tutions
const filteringTutions = async (req,res) => {
  // console.log(req.body)
  const {tution_type,tution_preference,medium,salary_range,number_of_days,location,page} = req.body
    let query =`
    SELECT tp.tution_id,
    l.location_name,tp.class as classname,tp.salary,tp.medium,tp.number_of_days,
    tp.user_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
    u.email,u.phone_number,u.name,
      COUNT(*) OVER () AS total_rows,
    STRING_AGG(s.subject_name, ', ') AS subject_name
    FROM tution_posts as tp 
    JOIN
    tution_subjects AS ts ON tp.tution_id = ts.tution_id
    JOIN subjects as s ON ts.subject_id = s.subject_id
    JOIN users as u ON tp.user_id = u.user_id
    JOIN locations as l ON tp.location_id=l.location_id
    `
const conditions = [];
const values = [];

if(tution_type!=="All" && tution_type?.length>0) {
  conditions.push(`tp.tution_type = $${values.length + 1}`);
  values.push(tution_type);
}
if(tution_preference!=="All" && tution_preference?.length>0) {
  conditions.push(`tp.tution_preference = $${values.length + 1}`);
  values.push(tution_preference);
}

if(medium!=="All" && medium?.length>0) {
  conditions.push(`tp.medium = $${values.length + 1}`);
  values.push(medium);
}

if(location!=="All" && location?.length>0) {
  conditions.push(`l.location_name = $${values.length + 1}`);
  values.push(location);
}


if(salary_range!=="All" && salary_range?.length>0) {
  const arrays = salary_range.split("-");
  const array2 = arrays.map((array)=>parseInt(array.replace('k','000')))
  conditions.push(`tp.salary BETWEEN $${values.length+1} AND $${values.length+2}`)
  values.push(array2[0]);
  values.push(array2[1]);

}

if (conditions.length > 0) {
  const whereClause = conditions.join(' AND ');
  query += ` WHERE ${whereClause}  AND tp.tution_status='approved' AND tp.available_status='available'
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,
  u.phone_number,u.name,tp.tution_preference,tp.tution_type
  OFFSET ${(page-1)*10} LIMIT 10`;
} else {
  query += `
  WHERE tp.tution_status='approved' AND tp.available_status='available'
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days, tp.user_id,
  tp.tution_status,tp.available_status,u.email,u.phone_number,u.name,tp.tution_preference,tp.tution_type
  OFFSET ${(page-1)*10} LIMIT 10`;
  }

  // console.log(query)
  const get_all_product = await pool.query(query,values)
    .then((posts)=> {
        res.send({
            success: true,
            message: "Successfully fetched all products",
            posts : posts.rows,
          });
    })
    .catch((error) => {
        res.send({
          success: false,
          message: "Something went wrong!!",
          error: error,
        });
      });



//   const query = await pool.query(`
//   SELECT tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
// tp.user_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,ts.subject_id,s.subject_name,
// u.email,u.phone_number,u.name,
//  COUNT(*) OVER () AS total_rows
// FROM tution_posts as tp 
// JOIN tution_subjects as ts ON tp.tution_id = ts.tution_id
// JOIN subjects as s ON ts.subject_id = s.subject_id
// JOIN locations as l ON tp.location_id=l.location_id
// JOIN users as u ON tp.user_id = u.user_id
// WHERE l.location_name='Noapara'
// AND tp.class='9' AND tp.salary BETWEEN 10000 AND 12000
// AND tp.tution_preference='Male' OR tp.tution_preference='Female'
// AND tp.medium='bangla'  AND tp.available_status='available' AND
//tp.tution_type='Home Tution' AND
// tp.tution_status='approved'
//   `)
  // .then((post)=> {
  //     res.send({
  //         success: true,
  //         message: "Successfully fetched all tutions",
  //         posts : post.rows
  //       });
  // })
  // .catch((error) => {
  //     res.send({
  //       success: false,
  //       message: "Something went wrong!!",
  //       error: error,
  //     });
  //   });
  
}

//total no of pending users

const totalNoOfPendingUsers = async (req,res) => {
  const query = await pool.query(`
  SELECT COUNT(*) as total FROM users WHERE role='tutor' AND status='pending'
  `)
  .then((post)=> {
      res.send({
          success: true,
          message: "Successfully fetched",
          total_no_of_pending_tutors : post.rows[0].total
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

  const totalNoOfApprovedUsers = async (req,res) => {
    const query = await pool.query(`
    SELECT COUNT(*) as total FROM users WHERE role='tutor' AND status='approved'
    `)
    .then((post)=> {
        res.send({
            success: true,
            message: "Successfully fetched",
            total_no_of_approved_tutors : post.rows[0].total
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

    const totalNoOfGuardians = async (req,res) => {
      const query = await pool.query(`
      SELECT COUNT(*) as total FROM users WHERE role='guardian' AND status='approved'
      `)
      .then((post)=> {
          res.send({
              success: true,
              message: "Successfully fetched",
              total_no_of_guardians : post.rows[0].total
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
  
      const totalNoOfApprovedTutions = async (req,res) => {

        const query = await pool.query(`SELECT COUNT(*) AS total_no_of_approved_tutions
        FROM tution_posts as tp
        WHERE tp.tution_status='approved'
        `)
        .then((post)=> {
            res.send({
                success: true,
                message: "Successfully fetched",
                posts : post.rows[0].total_no_of_approved_tutions
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
      
        const totalNoOfPendingTutions = async (req,res) => {

          const query = await pool.query(`SELECT COUNT(*) AS total_no_of_pending_tutions
          FROM tution_posts as tp
          WHERE tp.tution_status='pending'
          `)
          .then((post)=> {
              res.send({
                  success: true,
                  message: "Successfully fetched",
                  posts : post.rows[0].total_no_of_pending_tutions
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
        

module.exports = 
{addSubject,approvePost,declinedPost,getAllPendingPost,getAllApprovedPost,
  infoAboutAParticularTution,getAllTutionInformation,filteringTutions,totalNoOfPendingUsers,
  totalNoOfApprovedUsers,totalNoOfGuardians,totalNoOfApprovedTutions,totalNoOfPendingTutions,addLocation}
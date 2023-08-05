require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const pool = require("../../config/db");
const {v4 : uuidv4} = require("uuid");

const saltRounds = 10;

//Tution post
const postTution = async (req,res) => {
    
    try {
        const {location,salary,number_of_days,medium,classes,tution_preference,tution_type} = req.body;
        const {subjects} = req.body;
        const {info} = req;
        const user_id = info.id;
        const tution_id = uuidv4();
        const query = await pool.query("select location_id from locations WHERE location_name=$1",[location])
        const location_id = query.rows[0].location_id;
        const result1 = await pool.query(`INSERT into tution_posts (tution_id,location_id,class,salary,
          medium,number_of_days,user_id,tution_status,available_status,tution_preference,tution_type) 
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [tution_id,location_id,classes,salary,medium,number_of_days,user_id,"pending","available",
        tution_preference,tution_type])
        for (const subject of subjects) {
          pool.query(`
            INSERT INTO tution_subjects (subject_id,tution_id)
            VALUES ($1, $2)`, [subject,tution_id])
        }

        res.send({
          success: true,
          message: "Tution is posted Successfully",
        });
        
      } catch (error) {
        res.status(500).send(error.message);
      }


}

const tutionAvailableStatus = async (req,res) => {
  const {tution_id,available_status} = req.body;
  const declined = await pool.query(`UPDATE tution_posts SET available_status=$1 WHERE tution_id=$2`,[available_status,tution_id])

  .then((post)=> {
      res.send({
          success: true,
          message: "Tution status has been changed successfully",
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

const getAllSubjects = async (req,res) => {
    const allSubjects = await pool.query("select * from subjects")
    .then((subjects)=> {
        res.send({
            success: true,
            message: "Successfully fetched all subjects",
            subjects : subjects.rows
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


const getAllAssignedTution = async (req,res) => {
  const {id} = req.info;
  console.log(id)
  const tutions = await pool.query(`
  SELECT ast.tution_id,ast.tutor_id,ast.student_id,ast.assigned_status,
  u.name as tutor_name,u.email as tutor_email,u.phone_number as tutor_phone_number
  FROM assigned_tutions as ast
  JOIN users as u ON u.user_id=ast.tutor_id
  WHERE ast.assigned_status='Approved' AND
  ast.student_id=$1
  `,[id])
  .then((posts)=> {
      res.send({
          success: true,
          message: "Successfully fetched all assigned tutions",
          posts : posts.rows
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


const getAllLocations = async (req,res) => {
  const allSubjects = await pool.query("select * from locations")
  .then((locations)=> {
      res.send({
          success: true,
          message: "Successfully fetched all locations",
          locations : locations.rows
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


const getAllPostsByGuardian = async (req,res) => {
  const {id} = req.info;
    console.log(id)
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
    WHERE tp.user_id=$1  
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,u.name,
  tp.tution_preference,tp.tution_type

    `,[id])
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

const findTutions = async (req,res) => {

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
    WHERE tp.tution_status='approved' AND tp.available_status='available'   
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

const applyTution = async (req,res) => {
   const {tution_id,tutor_id,guardian_id} = req.body;
   const check = await pool.query(`
    SELECT * FROM assigned_tutions WHERE tution_id=$1 AND tutor_id=$2 AND student_id=$3
   `,[tution_id,tutor_id,guardian_id])
   
   if (check.rowCount===1) {
    return res.status(201).send({
      success: false,
      message: "Already applied to this tution",
    });
  }
    const apply = await pool.query(`INSERT into assigned_tutions 
    (tution_id,tutor_id,student_id,assigned_status) VALUES ($1,$2,$3,$4)`,
          [tution_id,tutor_id,guardian_id,"Pending"])
  
  .then((result)=> {
    return res.status(200).send({
      success: true,
      message: "Applied successfully",
    });
  })
  

}

const assignedTutor = async (req,res) => {
  const {tution_id,tutor_id,guardian_id} = req.body;
  const update = await pool.query(`
   UPDATE assigned_tutions SET assigned_status='Approved' WHERE tution_id=$1 AND tutor_id=$2 AND 
   student_id=$3
  `,[tution_id,tutor_id,guardian_id])

  const update2 = await pool.query(`
   UPDATE assigned_tutions SET assigned_status='Rejected' WHERE tution_id=$1 AND tutor_id!=$2 AND 
   student_id=$3
  `,[tution_id,tutor_id,guardian_id])

  const update3 = await pool.query(`
   UPDATE tution_posts SET available_status='not available' WHERE tution_id=$1
  `,[tution_id])
  
  return res.status(200).send({
    success: true,
    message: "Tutor is assigned successfully",
  });

  
}

//getAllAppliedTution by a turor
const getAllAppliedTution = async (req,res) => {
  const {id} = req.info;
  const query = pool.query(
    `
    SELECT tp.tution_id,
    l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
    tp.user_id as student_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
    u.email,u.phone_number,u.name,ast.assigned_status,ast.tutor_id,
      COUNT(*) OVER () AS total_rows,
    STRING_AGG(s.subject_name, ', ') AS subject_name
    FROM tution_posts as tp 
    JOIN
    tution_subjects AS ts ON tp.tution_id = ts.tution_id
    JOIN subjects as s ON ts.subject_id = s.subject_id
    JOIN users as u ON tp.user_id = u.user_id
    JOIN locations as l ON tp.location_id=l.location_id
    JOIN assigned_tutions as ast ON tp.tution_id=ast.tution_id
      WHERE tp.tution_status='approved' AND ast.tutor_id=$1
    GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
    tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,
    u.name,tp.tution_preference,tp.tution_type,ast.assigned_status,ast.tutor_id
    `,[id])
    .then((post)=> {
      res.send({
          success: true,
          message: "Successfully fetched all applied tutions",
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

//getAllApplication for a tution
const getAllRequest = async (req,res) => {
  const {id} = req.info;
  const query = pool.query(
    `
    SELECT tp.tution_id,
  l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id as guardian_id,tp.tution_status,tp.available_status,tp.tution_preference,tp.tution_type,
  u.email,u.phone_number as student_phone_number,u.name as student_name,ast.assigned_status,ast.tutor_id,
  
  applicant.name as applicant_name,applicant.email as applicant_email,
  applicant.phone_number as applicant_phone_number,

    COUNT(*) OVER () AS total_rows,
  STRING_AGG(s.subject_name, ', ') AS subject_name
  FROM tution_posts as tp 
  JOIN
  tution_subjects AS ts ON tp.tution_id = ts.tution_id
  JOIN subjects as s ON ts.subject_id = s.subject_id
  JOIN users as u ON tp.user_id = u.user_id
  JOIN locations as l ON tp.location_id=l.location_id
  JOIN assigned_tutions as ast ON tp.tution_id=ast.tution_id

  JOIN users as applicant ON applicant.user_id=ast.tutor_id

    WHERE tp.tution_status='approved' AND tp.user_id=$1 AND 
    ast.assigned_status!='Rejected'
    AND tp.available_status='available'
  GROUP BY tp.tution_id,l.location_name,tp.class,tp.salary,tp.medium,tp.number_of_days,
  tp.user_id,tp.tution_status,tp.available_status,u.email,u.phone_number,
  u.name,tp.tution_preference,tp.tution_type,ast.assigned_status,ast.tutor_id,

  applicant.name,applicant.email,applicant.phone_number


  ORDER BY tp.tution_id 

    `,[id])
    .then((post)=> {
      res.send({
          success: true,
          message: "Successfully fetched all applied tutions",
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


module.exports = {postTution,getAllSubjects,tutionAvailableStatus,
  getAllPostsByGuardian,applyTution,assignedTutor,getAllAppliedTution,getAllRequest,
  getAllLocations,findTutions,getAllAssignedTution}
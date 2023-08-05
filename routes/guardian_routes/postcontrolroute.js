const postcontrolrouter = require("express").Router();
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { postTution, getAllSubjects, tutionAvailableStatus, getAllPostsByGuardian, 
    applyTution, assignedTutor, getAllAppliedTution, 
    getAllRequest, getAllLocations, findTutions, getAllAssignedTution } =
     require("../../controllers/guardian_controllers/postcontroller");
const { isGuardian, isTutor } = require("../../controllers/user_controllers/authcontroller");


postcontrolrouter.post("/guardian/post-tution",isGuardian,postTution);
postcontrolrouter.get("/guardian/get-all-posts-by-a-particular-guardian",isGuardian,getAllPostsByGuardian);
postcontrolrouter.get("/find-tutions",isTutor,findTutions);
postcontrolrouter.put("/guardian/available-status",isGuardian,tutionAvailableStatus);
postcontrolrouter.get("/get-all-subjects",getAllSubjects);
postcontrolrouter.get("/get-all-locations",getAllLocations);
postcontrolrouter.post("/apply-tution",isTutor,applyTution);
postcontrolrouter.post("/assigned-tutor",isGuardian,assignedTutor);
postcontrolrouter.get("/get-all-applied-tutions",isTutor,getAllAppliedTution);
postcontrolrouter.get("/get-all-assigned-tutions",isGuardian,getAllAssignedTution);
postcontrolrouter.get("/get-all-requested-tutions",isGuardian,getAllRequest);

module.exports = postcontrolrouter;

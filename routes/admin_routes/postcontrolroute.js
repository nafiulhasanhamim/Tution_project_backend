const adminpostcontrolrouter = require("express").Router();
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addSubject, approvePost, declinedPost, getAllPendingPost, getAllApprovedPost, 
    infoAboutAParticularTution, getAllTutionInformation, filteringTutions, totalNoOfPendingUsers, 
    totalNoOfApprovedUsers, totalNoOfGuardians, totalNoOfApprovedTutions, 
    totalNoOfPendingTutions, 
    addLocation,
    deleteSubject} = require("../../controllers/admin_controllers/postcontroller");
const { isAdmin } = require("../../controllers/user_controllers/authcontroller");


adminpostcontrolrouter.post("/add-subject",isAdmin,addSubject);
adminpostcontrolrouter.post("/delete-subject",deleteSubject);
adminpostcontrolrouter.post("/add-location",isAdmin,addLocation); 
adminpostcontrolrouter.put("/approve-tution",isAdmin,approvePost);
adminpostcontrolrouter.put("/delete-tution",isAdmin,declinedPost);
adminpostcontrolrouter.get("/get-all-pending-tutions",isAdmin,getAllPendingPost);
adminpostcontrolrouter.get("/get-all-approved-tutions",isAdmin,getAllApprovedPost);
adminpostcontrolrouter.get("/get-all-tutions-information",isAdmin,getAllTutionInformation);
adminpostcontrolrouter.get("/get-information-about-a-particular-tution",isAdmin,infoAboutAParticularTution);
adminpostcontrolrouter.post("/filtering-tutions",filteringTutions);
adminpostcontrolrouter.get("/total-no-of-pending-tutors",isAdmin,totalNoOfPendingUsers);
adminpostcontrolrouter.get("/total-no-of-approved-tutors",isAdmin,totalNoOfApprovedUsers);
adminpostcontrolrouter.get("/total-no-of-guardians",isAdmin,totalNoOfGuardians);
adminpostcontrolrouter.get("/total-no-of-approved-tutions",isAdmin,totalNoOfApprovedTutions);
adminpostcontrolrouter.get("/total-no-of-pending-tutions",isAdmin,totalNoOfPendingTutions);

module.exports = adminpostcontrolrouter;

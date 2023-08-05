const usercontrolrouter = require("express").Router();
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isAdmin, isTutor, isGuardian } = require("../../controllers/user_controllers/authcontroller");
const { getAllTutors, getAllPendingTutors, getAllGuardians, approveTutor, getAParticularTutor, recommendedTutors, deleteTutor, getAllApprovedTutors, updatedTutorProfile, getAParticularGuardian, updatedGuardianProfile } = require("../../controllers/admin_controllers/usercontroller");

//getAllUsers
usercontrolrouter.get("/tutors/get-all-tutors",getAllTutors);
usercontrolrouter.post("/tutors/tutor-profile",getAParticularTutor);
usercontrolrouter.put("/tutors/updatedtutorprofile",isTutor,updatedTutorProfile);
usercontrolrouter.post("/guardians/guardian-profile",getAParticularGuardian);
usercontrolrouter.put("/guardians/updatedguardianprofile",isGuardian,updatedGuardianProfile);
usercontrolrouter.get("/tutors/recommended-tutors",recommendedTutors);
usercontrolrouter.get("/admin/guardians/get-all-guardians",isAdmin,getAllGuardians);
usercontrolrouter.get("/admin/pending-tutors/get-all-pending-tutors",isAdmin,getAllPendingTutors);
usercontrolrouter.get("/admin/get-all-approved-tutors",isAdmin,getAllApprovedTutors);
usercontrolrouter.put("/admin/pending-tutors/approve-user",isAdmin,approveTutor);
usercontrolrouter.put("/admin/pending-tutors/delete-tutor",isAdmin,deleteTutor);

module.exports = usercontrolrouter;

const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  updateUserProfileController,
  getAllDoctorsController,
  bookAppointmentController,
  checkAvailabilityController,
  appointmentListController
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
// update profile
router.post('/updateProfile', authMiddleware, updateUserProfileController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

// get all doctor
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// book appointment
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// check availability
router.post("/check-availability", authMiddleware, checkAvailabilityController);

//appointmentList
 router.post("/appointment-list", authMiddleware, appointmentListController);

module.exports = router;
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    getDoctorInfoController,
    updateDoctorProfileController,
    getDoctorByIdController
 } = require('../controllers/doctorCtrl');
const router = express.Router();

// single doctor info
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);
// update doctor profile
router.post('/updateProfile', authMiddleware, updateDoctorProfileController);
// single doc info
router.post("/getDoctorById" , authMiddleware , getDoctorByIdController);
module.exports = router;
const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");

// REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: `Error in Login CTRL ${error.message}`, success: false });
  }
};

// AUTH CONTROLLER ✅ Fixed
const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth error",
      success: false,
      error,
    });
  }
};

// APPLY DOCTOR CONTROLLER
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;

    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });

    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for Doctor",
    });
  }
};

// GET ALL NOTIFICATIONS ✅ Fixed
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification controller",
      success: false,
      error,
    });
  }
};

// DELETE NOTIFICATIONS ✅ Fixed
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    user.notification = [];
    user.seennotification = [];
    await user.save();

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({status: 'approved'});
        res.status(200).json({ message: 'All doctors fetched successfully', success:true, data: doctors });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching all doctors', error: error , success:false });
    }
};

const bookAppointmentController = async (req,res) => {
  try {
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const doctor = await doctorModel.findById(req.body.doctorId);
    doctor.notification.push({
      type: "new-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).json({ message: 'Appointment booked successfully', success:true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error booking appointment', error: error , success:false });
  }
}

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController
};

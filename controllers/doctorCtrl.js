const Doctor = require('../models/doctorModel');
const appointmentModel = require ('../models/appointmentModel.js');
const userModel = require('../models/userModels');


const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        res.status(200).json({ message: 'Doctor information fetched successfully', success:true, data: doctor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching doctor information', error: error , success:false });
    }
};

const updateDoctorProfileController = async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.body.userId },
            req.body,
            { new: true }
        );
        res.status(200).json({ message: 'Doctor profile updated successfully', success:true, data: doctor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating doctor profile', error: error , success:false });
    }
};

const getDoctorByIdController = async (req,res)=>{
    try {
        const doctor = await Doctor.findOne({_id:req.body.doctorId});
        res.status(200).json({message:'Doctor info fetched successfully' , success:true , data:doctor});
    } catch (error) {
        res.status(500).json({message:'Server Error fetching doctor info', error: error , success:false});
    }
}

const getAppointmentsController = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({ doctorId: doctor._id });
        res.status(200).json({ message: 'Appointments fetched successfully', success: true, data: appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error fetching appointments', error: error, success: false });
    }
}

const updateAppointmentStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { status }, { new: true });
        const user = await userModel.findOne({_id: appointment.userId});

        const username = req.body.userInfo.name || "";
        const notification = user.notification;
        notification.push({
            type: "status-updated",
            message: `Your appointment has been ${status}`,
            onClickPath: "/doctor-appointments",
        });
        await user.save();
        res.status(200).json({ message: 'Appointment status updated successfully', success: true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error updating appointment status', error: error, success: false });
    }
}

module.exports = {
    getDoctorInfoController , 
    updateDoctorProfileController , 
    getDoctorByIdController , 
    getAppointmentsController,
    updateAppointmentStatusController
};
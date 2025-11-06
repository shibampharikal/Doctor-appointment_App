const Doctor = require('../models/doctorModel');

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

module.exports = { getDoctorInfoController , updateDoctorProfileController , getDoctorByIdController};
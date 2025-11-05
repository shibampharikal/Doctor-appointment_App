const Doctor = require('../models/doctorModel');

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        res.status(200).json({ message: 'Doctor information fetched successfully', success:true, data: doctor });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching doctor information', error: error , success:false });
    }
};

module.exports = { getDoctorInfoController };
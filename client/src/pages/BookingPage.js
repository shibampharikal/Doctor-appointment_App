import React from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DatePicker, message, TimePicker } from 'antd';
import moment from 'moment';
import { useDispatch , useSelector } from 'react-redux';
import {hideLoading , showLoading} from "../redux/features/alertSlice"


function BookingPage() {
  const {user} = useSelector(state => state.user);
  const [doctor, setDoctor] = useState(null);
  const params= useParams();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState([null, null]);
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();


    const fetchDoctorData = async () => {
    try {
      const token = localStorage.getItem("token"); // get token from login
      if (!token) return;

      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in header
          },
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data); // store doctor info
      } else {
        console.log("Auth failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  const handleBooking = async() => {
    try {
        dispatch(showLoading);
        const res = axios.post("/api/v1/user/book-appointment",
            {
                userId:user._id,
                doctorId:params.doctorId,
                doctorInfo:doctor,
                date:date,
                userInfo:user,
                time:time,
            },
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        dispatch(hideLoading());
        if(res.data.success)
            message.success(res.data.message);
    } catch (error) {
        dispatch(hideLoading());
        console.error("Error booking appointment: ",error);
    }
  }

  useEffect(() => {
      fetchDoctorData();
    }, []);

  return (
    <Layout>
      <h2>Booking Page</h2>
      <div className='container m-2'>
        {doctor && (
                <div>
                    <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <h4>Fees: {doctor.feesPerConsultation}</h4>
                    <h4>Timings: {doctor.timing[0]} - {doctor.timing[1]}</h4>
                    <div className='d-flex flex-column w-50'>
                        <DatePicker className='mb-2' format='DD-MM-YYYY'
                        onChange={(value)=>setDate(moment(value).format("DD-MM-YYYY"))}
                        />
                        <TimePicker className='mb-2' format='HH:mm'
                        onChange={(value)=>setTime(moment(value).format("HH:mm"))}
                        />
                        <button className='btn btn-primary mt-3'>Check Availability</button>
                        <button className='btn btn-dark mt-3'
                        onClick={handleBooking}
                        >Book Now</button>
                    </div>
                </div>
            )
        }
      </div>
    </Layout>
  )
}

export default BookingPage

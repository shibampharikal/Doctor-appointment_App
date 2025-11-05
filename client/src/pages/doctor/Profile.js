import React, { useEffect } from 'react';
import Layout from "./../../components/Layout";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { head } from '../../../../routes/doctorRoutes';

const Profile = () => {
  const {user} = useSelector((state) => state.user);
  const [doctor,setDoctor] = React.useState(null);
  const params = useParams();

  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(`/api/v1/doctor/getDoctorInfo` ,
        {userId:params.id} ,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctor information:", error);
    }
  }

  useEffect(() => {
    getDoctorInfo();
  }, []);

  return (
    <Layout>
      <h1>Doctor Profile Page</h1>
    </Layout>
  );
};

export default Profile;

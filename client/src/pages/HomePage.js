import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList.js";
import { useSelector } from 'react-redux';

const HomePage = () => {
  const [doctors, setDoctor] = useState([]);
  const {user} = useSelector((state) => state.user) || {};

  // Function to fetch doctor data
  const fetchDoctorData = async () => {
    try {
      const token = localStorage.getItem("token"); // get token from login
      if (!token) return;

      const res = await axios.get(
        "/api/v1/user/getAllDoctors", // empty body
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

  // Call it on component mount
  useEffect(() => {
    fetchDoctorData();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>
      <Row>
        {doctors && doctors
          .filter((d) => d.userId !== user?._id)
          .map((doctor) => (
            <DoctorList key={doctor._id} doctor={doctor} />
          ))}
      </Row>
    </Layout>
  );
};

export default HomePage;

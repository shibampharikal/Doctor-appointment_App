import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const HomePage = () => {
  const [user, setUser] = useState(null);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // get token from login
      if (!token) return;

      const res = await axios.post(
        "/api/v1/user/getUserData",
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in header
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.data); // store user info
      } else {
        console.log("Auth failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Call it on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Layout>
      {user ? (
        <h1>Welcome, {user.name}</h1>
      ) : (
        <h1>Loading user data...</h1>
      )}
    </Layout>
  );
};

export default HomePage;

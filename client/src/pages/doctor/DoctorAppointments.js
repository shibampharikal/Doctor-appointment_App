import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
//import { showLoading, hideLoading } from '../../redux/alertsSlice';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //const [status , setStatus] = useState("");

  const fetchAppointments = async () => {
    try {
      //dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/doctor/getAppointments",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      //dispatch(hideLoading());
      const data = response.data;
      console.log(data.data);

      if (data.success) {
        const raw = data.data || [];

        // collect unique userIds
        const userIds = [...new Set(raw.map((a) => a.userId).filter(Boolean))];
        const userMap = {};

        // fetch user details for each id
        await Promise.all(
                    userIds.map(async (id) => {
            try {
              const userRes = await axios.post(
                "/api/v1/user/getUserById",
                { userId: id },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (userRes.data?.success && userRes.data.data) {
                userMap[id] = userRes.data.data;
              }
            } catch (e) {
              // ignore per-doctor errors
            }
          })
        );

        // enrich appointments with patientName, phone and email
        const enriched = raw.map((apt) => {
          let name = "Unknown";
          let phone = "";
          let email = "";
          // prefer map
          if (apt.userId && userMap[apt.userId]) {
            const d = userMap[apt.userId];
            // user could be a normal user (has .name) or a doctor (firstName/lastName)
            name = (d.name) ? d.name : `${d.firstName || ""} ${d.lastName || ""}`.trim() || name;
            phone = d.phone || "";
            email = d.email || "";
          } else if (apt.userInfo) {
            try {
              const info =
                typeof apt.userInfo === "string"
                  ? JSON.parse(apt.userInfo)
                  : apt.userInfo;
              if (info) {
                name =
                  (info.firstName || info.name || "") +
                  (info.lastName ? ` ${info.lastName}` : "");
                name = name.trim() || name;
                phone = info.phone || phone;
                email = info.email || email;
              }
            } catch (e) {
              // ignore parse errors
            }
          }
          return { ...apt, doctorName: name, doctorPhone: phone, doctorEmail: email };
        });
        setAppointments(enriched);
        //setStatus(data.status);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      //dispatch(hideLoading());
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    //if(user && user._id)
    fetchAppointments();
  }, [user]);

  const handleStatus = async (record, status) => {
    try {
      const response = await axios.post(
        "/api/v1/doctor/updateStatus",
        {
          appointmentId: record._id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      if (data.success) {
        message.success("Appointment status updated successfully");
        fetchAppointments();
      } else {
        message.error("Failed to update appointment status");
        fetchAppointments();
      }
    } catch (error) {
      console.log(error);

      console.error("Error updating appointment status:", error);
    }
  };

  const cols = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Patient Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorName ||
            (record.doctorInfo &&
              (record.doctorInfo.firstName
                ? `${record.doctorInfo.firstName} ${
                    record.doctorInfo.lastName || ""
                  }`
                : record.doctorInfo.name)) ||
            "Dr. Unknown"}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <span>
          {record.doctorEmail ||
            (record.userInfo && record.userInfo.email) ||
            ""}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div>
              <button
                style={{
                  padding: 8,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "none",
                  fontWeight: 600,
                  background: "blue",
                  color: "white",
                }}
                onClick={async () => handleStatus(record, "approved")}
              >
                Approved
              </button>
              <button
                className="ms-2"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "none",
                  fontWeight: 600,
                  background: "red",
                  color: "white",
                }}
                onClick={async () => handleStatus(record, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Appointments Page</h1>
      <Table columns={cols} dataSource={appointments} />
    </Layout>
  );
};

export default DoctorAppointments;

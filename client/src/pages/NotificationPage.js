import React from 'react';
import Layout from './../components/Layout';
import { message, Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);

  // ✅ Handle Mark All Read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/get-all-notification',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        dispatch(setUser(res.data.data)); // ✅ Update Redux user state immediately
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  //delete notifications

  const handleDeleteAllRead = async() => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/delete-all-notification',{userId:user._id},{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(hideLoading());
      if(res.data.success){
         message.success(res.data.message);
      }else{
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong in Notifications');
    }
   };

  return (
    <Layout>
      <h4 className="m-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="UnRead" key="0">
          <div className="d-flex justify-content-end">
            <h4 className="p-2" onClick={handleMarkAllRead} style={{ cursor: 'pointer' }}>
              Mark all Read
            </h4>
          </div>
          {
            user?.notification.map((notificationMsg, index) => (
              <div
                key={index}
                className="card"
                onClick={() => navigate(notificationMsg.onClickPath)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-text">
                  {notificationMsg.message}
                </div>
              </div>
            ))
          }
        </Tabs.TabPane>

        <Tabs.TabPane tab="Read" key="1">
          <div className="d-flex justify-content-end">
            <h4 className="p-2" onClick={handleDeleteAllRead} style={{ cursor: 'pointer' }}>
              Delete all Read
            </h4>
          </div>
          {
            user?.seennotification.map((notificationMsg, index) => (
              <div
                key={index}
                className="card"
                onClick={() => navigate(notificationMsg.onClickPath)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-text">
                  {notificationMsg.message}
                </div>
              </div>
            ))
          }
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;

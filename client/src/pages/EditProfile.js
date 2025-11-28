import React from 'react';
import Layout from '../components/Layout';
import { Form, Input, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';

const EditProfile = () => {
  const { user } = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/updateProfile', { ...values, userId: user._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message || 'Profile updated');
        // Update redux store
        dispatch(setUser(res.data.data));
        navigate('/user/profile/' + user._id);
      } else {
        message.error(res.data.message || 'Failed to update profile');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: '20px auto' }}>
        <h2>Edit Profile</h2>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ name: user?.name, email: user?.email, phone: user?.phone }}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save Changes</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default EditProfile;

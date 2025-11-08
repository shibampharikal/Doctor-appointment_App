import React from 'react';
import "../styles/RegisterStyle.css";  // Reuse same styling
import {Link,useNavigate} from 'react-router-dom';
import { Form, Input,message } from 'antd';
import {useDispatch} from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';

const Login = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();

  const onFinishHandler = async(values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login",values);
      dispatch(hideLoading());
      if(res.data.success){
        // store token before navigation so subsequent requests include it
        localStorage.setItem("token",res.data.token);
        message.success("Login Successfully");
        navigate("/");
      }
      else{
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong');
    }
  };

  return (
    <>
      <div className="form-container">
        <Form layout="vertical" onFinish={onFinishHandler} className="card p-4">
          <h3 className="text-center mb-3">Login Form</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to ="/register" className="m-2">User is not registered</Link>
          <button className="btn" type="submit">Login</button>
        </Form>
      </div>
    </>
  );
};

export default Login;

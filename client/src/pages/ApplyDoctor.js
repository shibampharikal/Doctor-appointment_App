import Layout from './../components/Layout';
import React from 'react';
import { Col, Form, Input, Row, TimePicker, Button,message } from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import{useNavigate} from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';
const ApplyDoctor = () => {
  // Handle form submission
  const {user} = useSelector(state => state.user)
    const dispatch =useDispatch();
  const navigate=useNavigate();
  const [form] = Form.useForm();

  const handleFinish = async(values) => {
    console.log('Form Values:', values);
    try {
        dispatch(showLoading())
        const res= await axios.post('/api/v1/user/apply-doctor',{...values,userId:user._id,
          timing:[
            values.timing[0].format("HH:mm"),
            values.timing[1].format("HH:mm")
          ]
        },{
          headers:{
             Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        });
      dispatch(hideLoading());
      if(res.data.success){
        message.success(res.data.message);
        navigate('/');
      }else{
        message.error(res.data.message);
      }
    } catch (error) {
        dispatch(hideLoading());
        console.log(error);
        message.error('Somethhing Went Wrong');
    }
    // You can later add axios POST request here to send to backend
  };

  return (
    <Layout>
      <h1 className="text-center">Apply Doctor</h1>
      <Form
      form={form}
       layout="vertical" onFinish={handleFinish} className="m-3">
        <h4>Personal Details :</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input placeholder="Your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Phone No." name="phone" rules={[{ required: true }]}>
              <Input placeholder="Your phone number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Your email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            {/* Website is now optional */}
            <Form.Item label="Website" name="website">
              <Input placeholder="Your website (optional)" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input placeholder="Your address" />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details :</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
              <Input placeholder="Your specialization" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
              <Input placeholder="Your experience" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Fees Per Consultation" name="feesPerConsultation" rules={[{ required: true }]}>
              <Input placeholder="Fees per consultation" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Timing" name="timing" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8} ></Col>
        <Col xs={24} md={12} lg={8} >
         <Button 
            type="primary" 
            htmlType="submit" 
            size="Large"
            style={{ padding: '4px 20px', fontSize: '14px', borderRadius: '6px' }}
          >
            Submit
          </Button>
        </Col>
        </Row>

        
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;

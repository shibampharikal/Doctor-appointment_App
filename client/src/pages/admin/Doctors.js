import React,{useState,useEffect} from 'react';
import Layout from './../../components/Layout';
import axios from 'axios';
import {Table ,message} from 'antd';

const Doctors = () => {
const [doctors,setDoctors] = useState([])
  //getUsers
  
    const getDoctors = async() =>{
      try {
        const res = await axios.get('/api/v1/admin/getAllDoctors',{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
          },
        });
        if(res.data.success){
            // keep only one doctor entry per userId (unique users)
            const all = res.data.data || [];
            // const uniqMap = all.reduce((acc, doc) => {
            //   if (!acc[doc.userId]) acc[doc.userId] = doc;
            //   return acc;
            // }, {});
            // const uniqueDoctors = Object.values(uniqMap);
            setDoctors(all);
        }
      } catch (error) {
        console.log(error);
      }
    };


//handle account 
const handleAccountStatus = async(record,status)=>{
 try {
  const res = await axios.post("/api/v1/admin/changeAccountStatus",
    {doctorId : record._id,userId : record.userId ,status:status},
    {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if(res.data.success){
    message.success(res.data.message);
    window.location.reload();
  }
 } catch (error) {
  message.error('Something Went Wrong');
 }
}

useEffect(()=>{
getDoctors();
},[]);

const columns = [
  {
    title:'Name',
    dataIndex : 'name',
    render:(text,record) =>(
      <span>{record.firstName} {record.lastName}</span>
    )
  },
  {
    title:'Status',
    dataIndex:'status'
  },
  {
    title:'Phone',
    dataIndex:'phone'
  },
  {
    title:"Actions",
    dataIndex:'action',
    render:(text,record) =>(
      <div className='d-flex'>
        
          <button
          style={{
                  padding: 8,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "none",
                  fontWeight: 600,
                  background: "blue",
                  color: "white",
                  marginRight: '10px'
                }} 
           onClick={() =>handleAccountStatus(record,"approved")}>Approve</button>
       
          <button 
          style={{
                  padding: 8,
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "none",
                  fontWeight: 600,
                  background: "red",
                  color: "white",
                }}
          onClick={() =>handleAccountStatus(record,"rejected")} >Reject</button>
        
      </div>
    ),
  },
];
    
  
  return (
    <Layout>
       <h1 className="text-center">All Doctors</h1>
    <Table
      columns={columns}
      dataSource={doctors}
      rowKey={(record) => record._id}
    /> 
    </Layout>
  )
}

export default Doctors;
import React , {useState , useEffect} from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';
import { Table , message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
//import { showLoading, hideLoading } from '../../redux/alertsSlice';

const DoctorAppointments = () => {

    const [appointments, setAppointments] = useState([])
        const {user} = useSelector(state => state.user);
        const dispatch = useDispatch();
    
        const fetchAppointments = async () => {
                try {
                    //dispatch(showLoading());
                    const response = await axios.post('/api/v1/doctor/getAppointments',
                        {
                            userId: user._id
                        },
                        {
                            headers:{
                                Authorization:`Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    //dispatch(hideLoading());
                    const data = response.data;
                    console.log(data.data);
                    
                    if (data.success) {
                        setAppointments(data.data);
                    } else {
                        console.error(data.message);
                    }
                } catch (error) {
                    //dispatch(hideLoading());
                    console.error('Error fetching appointments:', error);
                }
            };
    
    
        useEffect(() => {
            if(user && user._id)
                fetchAppointments();
        }, [user]);

        const handleStatus = async (record, status) => {
            try {
                const response = await axios.post('/api/v1/doctor/updateStatus', {
                    appointmentId: record._id,
                    status
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = response.data;
                if (data.success) {
                    message.success('Appointment status updated successfully');
                    fetchAppointments();
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.log(error);
                
                console.error('Error updating appointment status:', error);
            }
        }

    const cols = [
            {
                title:"ID",
                dataIndex:"_id",
            },
            // {
            //     title:"Name",
            //     dataIndex:"name",
            //     render:(text,record) => (<span>
            //         {record.doctorInfo.firstName} {record.doctorInfo.lastName}
            //     </span>)
            // },
            // {
            //     title:"Phone",
            //     dataIndex:"phone",
            //     render:(text,record) => (<span>
            //         {record.doctorInfo.phone}
            //     </span>)
            // },
            {
                title:"Date & Time",
                dataIndex:"date",
                render:(text,record) => (<span>
                    {moment(record.date).format("DD-MM-YYYY")} &nbsp; {moment(record.time).format("HH:mm")}
                </span>)
            },
            {
                title:"Status",
                dataIndex:"status",
            },
            {
                title:"Actions",
                dataIndex:"actions",
                render:(text,record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && (
                        <div>
                            <button className='btn btn-success'
                            onClick={async() => handleStatus(record,'approved')}
                        >Approved</button>
                        <button className='btn btn-danger ms-2'
                            onClick={async() => handleStatus(record,'rejected')}
                        >Reject</button>
                        </div>
                    )
                    }
                </div>
                )
            }
        ]

  return (
    <Layout>
      <h1>Appointments Page</h1>
      <Table columns={cols} dataSource={appointments} />
    </Layout>
  )
}

export default DoctorAppointments

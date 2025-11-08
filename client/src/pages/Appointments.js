import React , {useState , useEffect} from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import { useSelector , useDispatch } from 'react-redux';
import moment from 'moment';
import { Table } from 'antd';

const Appointments = () => {

    const [appointments, setAppointments] = useState([])
    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();

    const fetchAppointments = async () => {
            try {
                //dispatch(showLoading());
                const response = await axios.post('/api/v1/user/appointment-list',
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

    const cols = [
        {
            title:"ID",
            dataIndex:"_id",
        },
        {
            title:"Name",
            dataIndex:"name",
            render:(text,record) => (<span>
                {record.doctorInfo.firstName} {record.doctorInfo.lastName}
            </span>)
        },
        {
            title:"Phone",
            dataIndex:"phone",
            render:(text,record) => (<span>
                {record.doctorInfo.phone}
            </span>)
        },
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
    ]

  return (
    <Layout>
      <h1>Appointments Page</h1>
      <Table columns={cols} dataSource={appointments} />
    </Layout>
  )
}

export default Appointments

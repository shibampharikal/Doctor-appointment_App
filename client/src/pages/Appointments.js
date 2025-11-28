import React , {useState , useEffect} from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import { useSelector , useDispatch } from 'react-redux';
import moment from 'moment';
import { Table } from 'antd';

const Appointments = () => {

    const [appointments, setAppointments] = useState([]);
    const [docData, setDocData] = useState({});
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
                const data = response.data;
                // dispatch(hideLoading());
                if (data.success) {
                    const raw = data.data || [];

                    // collect unique doctorIds
                    const doctorIds = [...new Set(raw.map(a => a.doctorId).filter(Boolean))];
                    const doctorMap = {};

                    // fetch doctor details for each id
                    await Promise.all(doctorIds.map(async (id) => {
                        try {
                            const docRes = await axios.post('/api/v1/doctor/getDoctorById', { doctorId: id }, {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            });
                            if (docRes.data?.success && docRes.data.data) {
                                doctorMap[id] = docRes.data.data;
                            }
                        } catch (e) {
                            // ignore per-doctor errors
                        }
                    }));

                    // enrich appointments with doctorName and phone
                    const enriched = raw.map((apt) => {
                        let name = 'Dr. Unknown';
                        let phone = '';
                        // prefer map
                        if (apt.doctorId && doctorMap[apt.doctorId]) {
                            const d = doctorMap[apt.doctorId];
                            name = `${d.firstName || ''} ${d.lastName || ''}`.trim() || name;
                            phone = d.phone || '';
                        } else if (apt.doctorInfo) {
                            try {
                                const info = typeof apt.doctorInfo === 'string' ? JSON.parse(apt.doctorInfo) : apt.doctorInfo;
                                if (info) {
                                    name = (info.firstName || info.name || '') + (info.lastName ? ` ${info.lastName}` : '');
                                    name = name.trim() || name;
                                    phone = info.phone || phone;
                                }
                            } catch (e) {
                                // ignore parse errors
                            }
                        }
                        return { ...apt, doctorName: name, doctorPhone: phone };
                    });

                    setAppointments(enriched);
                    setDocData(doctorMap);
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
                {record.doctorName || (record.doctorInfo && (record.doctorInfo.firstName ? `${record.doctorInfo.firstName} ${record.doctorInfo.lastName || ''}` : record.doctorInfo.name)) || 'Dr. Unknown'}
            </span>)
        },
        {
            title:"Phone",
            dataIndex:"phone",
            render:(text,record) => (<span>
                {record.doctorPhone || (record.doctorInfo && (record.doctorInfo.phone)) || ''}
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

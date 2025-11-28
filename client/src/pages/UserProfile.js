import  Layout  from '../components/Layout.js'
import React , {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import '../styles/UserProfile.css';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';


const UserProfile = () => {
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.user) || {};
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAppointments = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
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

        if (response.data.success) {
          const raw = response.data.data || [];

          // Batch fetch unique doctor names to avoid duplicate requests
          const doctorIds = [...new Set(raw.map(a => a.doctorId).filter(Boolean))];
          const doctorMap = {};

          await Promise.all(doctorIds.map(async (id) => {
            try {
              const docRes = await axios.post('/api/v1/doctor/getDoctorById', { doctorId: id }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
              if (docRes.data?.success && docRes.data.data) {
                const d = docRes.data.data;
                doctorMap[id] = `${d.firstName || ''} ${d.lastName || ''}`.trim();
              }
            } catch (e) {
              // ignore individual doctor fetch errors
            }
          }));

          const enriched = raw.map((apt) => {
            let docName = doctorMap[apt.doctorId] || 'Dr. Unknown';

            // fallback to doctorInfo if map doesn't have it
            if ((!docName || docName === 'Dr. Unknown') && apt.doctorInfo) {
              try {
                let docInfo = apt.doctorInfo;
                if (typeof docInfo === 'string') {
                  docInfo = JSON.parse(docInfo);
                }
                if (docInfo && typeof docInfo === 'object') {
                  docName = (docInfo.firstName || docInfo.name || '') + (docInfo.lastName ? ` ${docInfo.lastName}` : '');
                  docName = docName.trim() || docName;
                } else if (typeof docInfo === 'string') {
                  docName = docInfo;
                }
              } catch (e) {
                // ignore
              }
            }

            const initials = (docName || 'Dr').split(' ').map(n => n[0] || '').join('').substring(0,2).toUpperCase();
            return { ...apt, doctorName: docName || 'Dr. Unknown', doctorInitials: initials };
          });

          setAppointments(enriched);
        } else {
          console.error(response.data.message);
          message.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        message.error('Error fetching appointments');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user?._id]);

    const handleLogout = () => {
        localStorage.clear();
        message.success("Logout Successfully");
        navigate("/login");
      };

    const initials = (name = '') => {
        const parts = name.trim().split(' ');
        if(parts.length === 0) return 'U';
        if(parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length-1].charAt(0)).toUpperCase();
    }

    // Calculate upcoming and past appointments
    const upcomingCount = appointments.filter(apt => {
        const aptDate = moment(apt.date);
        return aptDate.isAfter(moment());
    }).length;

    const pastCount = appointments.filter(apt => {
        const aptDate = moment(apt.date);
        return aptDate.isBefore(moment());
    }).length;

    // Get recent appointments (last 3)
    const recentAppointments = appointments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    // Parse doctor info if it's a string
    const parseDocInfo = (doctorInfo) => {
        try {
            return typeof doctorInfo === 'string' ? JSON.parse(doctorInfo) : doctorInfo;
        } catch {
            return { name: 'Unknown Doctor' };
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'approved': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    // removed async in-render doctor fetch; enrichment is handled in fetchAppointments

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-wrapper">
          <aside className="profile-card">
            <div className="profile-head">
              <div className="avatar">{initials(user?.name)}</div>
              <div>
                <div className="profile-name">{user?.name || 'Unknown User'}</div>
                <div className="profile-role">{user?.isDoctor ? 'Doctor' : user?.isAdmin ? 'Admin' : 'Patient'}</div>
              </div>
            </div>

            <div className="meta">
              <div>
                <div className="label">Email</div>
                <div>{user?.email || '—'}</div>
              </div>
              <div>
                <div className="label">Phone</div>
                <div>{user?.phone || 'Not added'}</div>
              </div>
              <div className="actions">
                <button onClick={() => navigate('/user/edit-profile')} className="btn btn-edit">Edit Profile</button>
                <button onClick={handleLogout} className="btn btn-logout">Logout</button>
              </div>
            </div>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-num">{appointments.length}</div>
                <div className="stat-label">Total Appointments</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{upcomingCount}</div>
                <div className="stat-label">Upcoming</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{pastCount}</div>
                <div className="stat-label">Past</div>
              </div>
            </div>
          </aside>

          <main className="content-card">
            <h3 style={{margin:0, marginBottom:12}}>Recent Appointments</h3>
            <div className="recent-list">
              {loading ? (
                <div style={{padding: 20, textAlign: 'center', color: '#6b7280'}}>
                  Loading appointments...
                </div>
              ) : recentAppointments.length > 0 ? (
                recentAppointments.map((apt) => {
                  const docName = apt.doctorName || 'Dr. Unknown';
                  const docInitials = (apt.doctorInitials || docName.split(' ').map(n => n[0]).join('').substring(0,2)).toUpperCase();

                  return (
                    <div key={apt._id} className="recent-item">
                      <div className="recent-left">
                        <div style={{width:44,height:44,borderRadius:8,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center',color:'#5b21b6',fontWeight:700,fontSize:12}}>
                          {docInitials}
                        </div>
                        <div>
                          <div className="recent-title">{docName}</div>
                          <div className="recent-time">{moment(apt.date).format('MMM DD, YYYY')} at {moment(apt.time).format('HH:mm')}</div>
                        </div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span style={{fontSize: 11, fontWeight: 600, color: getStatusColor(apt.status), textTransform: 'uppercase'}}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="recent-item">
                  <div className="recent-left">
                    <div style={{width:44,height:44,borderRadius:8,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center',color:'#5b21b6',fontWeight:700}}>DR</div>
                    <div>
                      <div className="recent-title">No appointments yet</div>
                      <div className="recent-time">You have no recent bookings.</div>
                    </div>
                  </div>
                  <div style={{color:'#6b7280',fontSize:12}}>—</div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default UserProfile

import React from 'react';
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from '../Data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message, Badge } from 'antd';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };


//========== doctor menu ==========
const doctorMenu =[
    {
         name:'Home',
         path:'/',
         icon:"fa-solid fa-house",
    },
    {
        name:'Appointments',
        path:"/appointments",
        icon:"fa-solid fa-list",
    },
   
    {
        name:'Profile',
        path:`/doctor/profile/${user?._id}`,
        icon:"fa-solid fa-user",
    },
   
  ];
//==========doctor menu ===========  
  // rendering menu list
  const SidebarMenu = user?.isAdmin
   ? adminMenu 
   : user?.isDoctor
   ?doctorMenu
   : userMenu;

  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>DOC APP</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div
                    className={`menu-item ${isActive && "active"}`}
                    key={menu.path}
                  >
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                );
              })}

              <div className="menu-item" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="header">
              <div className="header-left">
                <h3></h3>
              </div>

              <div className="header-right">
                {/* ✅ Fixed notification bell + badge */}
                <Badge
                  count={user?.notification?.length || 0}
                  overflowCount={9}
                  style={{ backgroundColor: '#f5222d', cursor: 'pointer' }}
                  onClick={() => navigate('/notification')}
                >
                  <i
                    className="fa-solid fa-bell"
                    style={{
                      fontSize: '20px',
                      color: '#555',
                      marginRight: '20px',
                    }}
                  ></i>
                </Badge>

               <Link to={`/doctor/profile/${user?._id}`}>{user?.name}</Link>
              </div>
            </div>

            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;

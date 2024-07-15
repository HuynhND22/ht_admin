import React from "react";
import { BrowserRouter as Router, Route, Routes, Link,useNavigate } from "react-router-dom";
import Categories from "../../pages/categories";

import Posts from "../../pages/posts";
import Users from "../../pages/users";
import Books from "../../pages/books";
import Home from "../../pages/home";
import Styles from "../../styles/layout/layout.module.css";
import { HomeOutlined } from "@ant-design/icons";
import {Avatar, Button, Space, Breadcrumb} from "antd";
import NotPermisstion from "../../pages/notPermisstion";

function Layout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('accessToken')
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    navigate('/login')
  }
  const user:any = localStorage.getItem('user') ?? sessionStorage.getItem('user')
  const name = JSON.parse(user).name

  const isAdmin = JSON.parse(user).role

       

  return (
    <div className={Styles.container}>
      {/*<Router>*/}
        <nav>
          <div>
            <span>
              <Space direction="horizontal" size={10}>
                <Space wrap size={16}></Space>
                <Avatar size={64} icon={<HomeOutlined onClick={()=>{navigate('/')}} />} />
                <div style={{color:'white'}}>
                {
                  name
                }
                </div>
              </Space>
            </span>
          </div>
          <div className={Styles.item}>
              <Link to="/categories">Danh mục</Link>
              <Link to="/posts">Bài đăng</Link>
              <Link to="/books">File Sách</Link>
              <Link to="/users">Người dùng</Link>
            <div style={{ margin:10, marginLeft:100 }}>
              <Button onClick={()=>logout()}>Đăng xuất</Button>
            </div>
          </div>
        </nav>
        <h2>
       
        </h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/books" element={<Books />} />
          <Route path="/users" element={<Users />} />
          <Route path="/not-permission" element={<NotPermisstion />} />
        </Routes>
      {/*</Router>*/}
    </div>
  );
}

export default Layout;

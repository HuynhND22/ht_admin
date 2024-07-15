// src/pages/Login.js
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import getInfoStorage from '../helpers/getInfoStorege'
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isLoggedIn = getInfoStorage.accessToken

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response:any = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        values
      )

      if (response.data) {
        console.log(response.data);
        if (values.remember) {
          localStorage.setItem("accessToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem("accessToken", response.data.token);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }
        if (JSON.stringify(response.data.user.role != 'Quản trị viên' )) {
          navigate("/orders");
        } else {
          navigate("/");
        }
        message.success("Đăng nhập thành công!");
      } else {
        message.error('Dữ liệu rỗng')
      }
    } catch (error:any) {
      if (error.response.status === 400) {
        message.error("Email chưa chính xác");
      } else if (error.response.status === 401){
        message.error("Email hoặc mật khẩu chưa chính xác");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>
      <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
              { required: true, message: "Email không thể để trống!" },
              { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Mật khẩu không thể để trống!" }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

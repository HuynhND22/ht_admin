import { useRequest } from 'ahooks';
import {  Card, DatePicker, Form, Input, message, Modal } from 'antd';
import React from 'react';

import { FieldType } from '../types/Categories/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table } from 'antd';
import { Link } from 'react-router-dom';
const NotPermisstion: React.FC = () => {

    return (
        <div style={{ padding: 36 }}>
           Not Permission
        </div>
    );
};

export default NotPermisstion;

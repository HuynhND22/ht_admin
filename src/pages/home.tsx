import React from 'react';
import {Card, message, Button, Space, Col, Row, DatePicker} from 'antd';
import { FieldType } from '../types/Categories/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined, UndoOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

const Home: React.FC = () => {
const { RangePicker } = DatePicker;

  const [orders, setOrders] = React.useState<any>([]);
  const [status, setStatus] = React.useState<any>([]);
  const today = new Date()
  const [from, setFrom] = React.useState<any>(dayjs(today).subtract(1, 'day').format('YYYY-MM-DD'));
  const [to, setTo] = React.useState<any>(dayjs(today).format('YYYY-MM-DD'));
  const [deleted, setDeleted] = React.useState<'all' | 'deleted'>('all');

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement
  );

  const getOrder = async () => {
    const today = new Date();
  }

const getData = async () => {
  try {
      console.log(from);  
      const response = await axiosClient.get(`/statistics/orders/date?from=${from}&to=${to}` ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const res = await axiosClient.get(`/statistics/status-orders/date?from=${from}&to=${to}` ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setOrders(response.data)
      setStatus(res.data)
    } catch (error) {
      console.log('Error:', error);
      message.error('Lấy dữ liệu thất bại!')
    }
}

React.useEffect(()=> {
  getData()
}, [from, to])


  const orderByDate = async (values: any) => {
    setFrom(dayjs(values[0]).format('YYYY-MM-DD'))
    setTo(dayjs(values[1]).format('YYYY-MM-DD'))
  };



  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
      },
    },
  };
  const labels:any[] = orders.map((x:any)=>dayjs(x.date).format('DD/MM/YYYY'));
  const datasets:any[] = orders.map((x:any)=>x.totalOrders);
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'phần cần thống kê',
        data: datasets,
        // labels.map(() => 1),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };






 let status1 = 0
 let status2 = 0
 let status3 = 0
 let status4 = 0
 status.map((x:any)=>{
   if(x.statusId === 10) status1 = x.count
   if(x.statusId === 11) status2 = x.count
   if(x.statusId === 12) status3 = x.count
   if(x.statusId === 13) status4 = x.count
 });

 const dataDoughnut = {
  labels: ['Đợi thanh toán', 'Đang chuẩn bị', 'Đã Xong', 'Đã huỷ'],
  datasets: [
    {
      label: 'Số đơn hàng',
      data: [status1, status2, status3, status4],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
};


  return (
    <div style={{ padding: 36 }} >
      <Row gutter={24}>
        <Col span={12}>
          <Card 
            title={<Space>Thống kê đơn hàng từ <RangePicker format={'DD/MM/YYYY'} onChange={(value:any)=> {orderByDate(value)}} /></Space>} 
            style={{ width: '100%' }}>
              <Line options={options} data={data} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={'Trạng thái đơn hàng'} style={{ width: '100%', paddingLeft: '23%', paddingRight:'23%' }}>
            <Doughnut data={dataDoughnut} options={options} />
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

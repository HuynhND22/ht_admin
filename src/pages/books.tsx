import React from "react";
import {
  Card,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Button,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Select,
  Upload,
  UploadFile,
  GetProp,
  UploadProps
} from "antd";
import { Option } from "antd/es/mentions";
import { FieldType } from "../types/Categories/index";
import axiosClient from "../configs/axiosClient";
import {
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
  QuestionCircleOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
const Books: React.FC = () => {
  const [books, setBooks] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [fileListUpdate, setFileListUpdate] = React.useState<UploadFile[]>([]);
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const [updateForm] = Form.useForm<FieldType>();
  const [deleted, setDeleted] = React.useState<"all" | "deleted">("all");
  const getBooks = async () => {
    try {
      const response = await axiosClient.get(`/books/${deleted}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const getCategories = async () => {
    try {
      const response = await axiosClient.get(`/categories/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  React.useEffect(() => {
    getCategories();
    getBooks();
  }, [deleted]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  }

  const handleCreate = async (values: any) => {
    const formData:any = new FormData();

    Object.entries(values).forEach(([key, value]:any)=>{
      console.log('key ', key, 'value ', value);
      if (value) {
        formData.append(key, JSON.stringify(value))
      }
    })

    fileList.map((value)=>{
      formData.append('file', value.originFileObj);
      console.log('origin', value.originFileObj);  
    })
    console.log('file', fileList);  
    try {
      await axiosClient.post("/books/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getBooks();
      createForm.resetFields();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      console.log("Success:", values);
      await axiosClient.patch(
        `/books/update/${selectedCategory.categoryId}`,
        values,
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
      );
      getBooks();
      setSelectedCategory(null);
      message.success("Cập nhật thành công!");
    } catch (error) {
      console.log("Error:", error);
      message.error("Thao tác thất bại!");
    }
  };

  const handleRemove = async (categoryId: number) => {
    console.log(categoryId);  
    try {
      await axiosClient.delete(`/books/remove/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getBooks();
      message.success("Đã xóa!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await axiosClient.delete(`/books/delete/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getBooks();
      message.success("Đã xóa!");
    } catch (error) {
      message.error("Thao tác thất bại!");
      console.log(error);
    }
  };

  const handleRestore = async (bookId: number) => {
    console.log(bookId);  
    try {
      await axiosClient.post(`/books/restore`, {bookId: bookId}, {
         headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getBooks();
      message.success("Khôi phục thành công!");
    } catch (error) {
      console.log(error);
      message.error("Thao tác thất bại!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "bookId",
      key: "bookId",
      width: "1%",
    },
    {
      title: "Tên file sách",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (text:string, record:any) => {
        return record.category?.name
      }
    },
    {
      title: deleted == "all" ? "Ngày tạo - cập nhật gần nhất" : "Ngày xóa",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: any, record: any) => {
        if (deleted == "all") {
          return (
            <span>
              {dayjs(record.createdAt).format("HH:mm DD/MM/YYYY")} -{" "}
              {dayjs(record.updatedAt).format("HH:mm DD/MM/YYYY")}
            </span>
          );
        } else {
          return (
            <span>{dayjs(record.deletedAt).format("HH:mm DD/MM/YYYY")}</span>
          );
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        if (deleted == "all") {
          return (
            <Space size="small">
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedCategory(record);
                     if(record.url) {setFileListUpdate([
                    {
                      uid: record.url?.split('/').pop(),
                      name: record.url?.split('-').pop(),
                      status: 'done',
                      url: process.env.REACT_APP_API_BASE_URL + '/' + record.url
                    }])}
                    updateForm.setFieldsValue(record);
                    console.log(record);
                  }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(record.bookId)}
                />
              </Tooltip>
            </Space>
          );
        } else if (deleted == "deleted") {
          return (
            <Space size="small">
              <Tooltip title="Khôi phục">
                <Button
                  type="primary"
                  icon={<UndoOutlined />}
                  onClick={() => handleRestore(record.bookId)}
                />
              </Tooltip>
              <Tooltip title="Xóa Vĩnh viễn">
                <Popconfirm
                  title="Chắc chắn muốn xóa vĩnh viễn?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => {
                    handleDelete(record.bookId);
                  }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        }
      },
    },
  ];
  const checkNameUnique = async (cb: any, name: string, oldName?: string) => {
    try {
      const res = await axiosClient.get(
        `/books/check/unique?field=name&value=${name}&ignore=${oldName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
      );
      console.log(res);
      cb(undefined);
    } catch (error) {
      cb(true);
    }
  };
  const { data, run: checkNameUniqueDebounce } = useRequest(checkNameUnique, {
    debounceWait: 500,
    manual: true,
    cacheTime: 0,
  });
  return (
    <div style={{ padding: 36 }}>
      <Card title="Thêm file sách mới" style={{ width: "100%" }}>
        <Form
          form={createForm}
          name="create-category"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 12 }}
          onFinish={(value) => handleCreate(value)}
        >
          <Form.Item
            label="Tên file sách"
            labelCol={{ span: 6 }}
            name="name"
            rules={[
              { required: true, message: "Tên file sách là bắt buộc!" },
              {
                validator(rule, value, callback) {
                  checkNameUniqueDebounce(callback, value);
                },
                message: "Tên file sách đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item label="Danh mục" labelCol={{ span: 6 }} name="categoryId" rules={[{required:true, message: 'Danh mục là bắt buộc!'}]} hasFeedback>
            <Select>
               {
              categories && categories?.map((value:any)=> {
                console.log(value);  
                if (value.children) {
                   return value.children.map((item:any) => {
                     return <Option value={item.categoryId}>{value.name} {'>'} {item.name}</Option>
                   })
                }
              })
            }
            </Select>
          </Form.Item>
          <Form.Item
            label="file sách"
            labelCol={{ span: 6 }}
            rules={[
              { required: true, message: "file sách là bắt buộc!" },
            ]}
            hasFeedback
          >
            <Upload 
              accept='text/pdf'
              maxCount={1}
              onChange={handleChange} 
              beforeUpload={(file) => false}
            >
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit">
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            Danh sách file sách
            <Radio.Group
              value={deleted}
              onChange={(e) => setDeleted(e.target.value)}
            >
              <Radio.Button style={{ color: "#1677FF" }} value="all">
                Đang hoạt động
              </Radio.Button>
              <Radio.Button style={{ color: "red" }} value="deleted">
                Đã xóa
              </Radio.Button>
            </Radio.Group>
          </Space>
        }
        style={{ width: "100%", marginTop: 36 }}
      >
        <Table dataSource={books} columns={columns} />
      </Card>

      <Modal
        centered
        open={selectedCategory}
        title="Chỉnh sửa file sách"
        okText="Lưu thay đổi"
        cancelText="Huỷ"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedCategory(null);
        }}
      >
        <Form
          form={updateForm}
          name="update-category"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Tên file sách"
            name="name"
            rules={[
              { required: true, message: "Tên file sách là bắt buộc!" },
              {
                validator(rule, value, callback) {
                  checkNameUniqueDebounce(
                    callback,
                    value,
                    selectedCategory.name
                  );
                },
                message: "Tên file sách đã tồn tại",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item label="Danh mục" name="categoryId">
           <Select>
              {
              categories && categories?.map((value:any)=> {
                if (value.parentId) return <Option value={value.categoryId}>{value.parent?.name} {'>'} {value.name}</Option>
              })
            }
            </Select>
          </Form.Item>
           <Form.Item
            label="file sách"
            labelCol={{ span: 8 }}
            rules={[
              { required: true, message: "file sách là bắt buộc!" },
            ]}
            hasFeedback
          >
            <Upload 
              accept='text/pdf'
              maxCount={1}
              fileList={fileListUpdate}
              onChange={handleChange} 
              beforeUpload={(file) => false}
            >
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Books;

import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Table,
  Popconfirm,
  message,
  Modal,
  Select,
  Upload,
  Image,
  GetProp,
  UploadFile,
  UploadProps,
  Radio,
  Tooltip,
} from "antd";
import { Option } from "antd/es/mentions";
import React from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import axiosClient from "../configs/axiosClient";
import FormData from "form-data";
import { debounce } from "ahooks/es/utils/lodash-polyfill";
import dayjs from "dayjs";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { uploadAdapterPlugin } from "../helpers//uploadAdapter";

type Props = {};
export default function Posts({}: Props) {
  const [post, setPosts] = React.useState<any>([]);
  const [categories, setCategories] = React.useState([]);
  const [content, setContent] = React.useState<any>();
  const [contentUpdate, setContentUpdate] = React.useState<any>();
  const [selectedPost, setSelectedPost] = React.useState<any>(null);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [file, setFile] = React.useState([]);
  const [deleted, setDeleted] = React.useState("all");
  const [waitting, setWaitting] = React.useState<boolean>(false);

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [cover, setCover] = React.useState<any>();
  const [fileListUpdate, setFileListUpdate] = React.useState<UploadFile[]>([]);
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
  };
  const handleChangeUpdate: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileListUpdate(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getPost = async () => {
    try {
      const response = await axiosClient.get(`/posts/${deleted}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setPosts(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axiosClient.get("/categories/all", {
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
    getPost();
  }, [deleted]);

  const onFinish = async (values: any) => {
    setWaitting(true);
    const formData: any = new FormData();
    if (fileList) {
      console.log(fileList);
      fileList.map((value) => {
        formData.append("image", value.originFileObj);
      });
    }

    Object.entries(values).forEach(([key, value]: any) => {
      console.log("key ", key, "value ", value);
      if (value) {
        formData.append(key, JSON.stringify(value));
      }
    });
    formData.append("content", content);
    try {
      const response = await axiosClient.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getPost();
      setContent(null);
      createForm.resetFields();
      setFileList([]);
      message.success("Thêm thành công!");
    } catch (error) {
      message.error("Thêm thất bại!");
      console.log("Error:", error);
    } finally {
      setWaitting(false);
    }
  };

  const onUpdate = async (values: any) => {
    setWaitting(true);
    const formData: any = new FormData();
    fileListUpdate.map((value) => {
      formData.append("image", value.originFileObj);
    });
    Object.entries(values).forEach(([key, value]: any) => {
      console.log("key ", key, "value ", value);
      if (value) {
        formData.append(key, JSON.stringify(value));
      }
    });
    formData.append("content", contentUpdate);

    try {
      await axiosClient.patch(
        `/posts/update/${selectedPost.postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      getPost();
      setSelectedPost(null);
      message.success("Cập nhật thành công!");
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setWaitting(false);
    }
  };

  const handleRemove = async (postId: number) => {
    try {
      await axiosClient.delete(`/posts/remove/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getPost();
      message.success("Đã xóa!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await axiosClient.delete(`/posts/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getPost();
      message.success("Đã xóa!");
    } catch (error) {
      message.error("Thao tác thất bại!");
      console.log(error);
    }
  };

  const handleRestore = async (categoryId: number) => {
    try {
      await axiosClient.post(`/posts/restore/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getPost();
      message.success("Khôi phục thành công!");
    } catch (error) {
      console.log(error);
      message.error("Thao tác thất bại!");
    }
  };

  const onDelete = async (postId: number) => {
    try {
      await axiosClient.delete(`/posts/remove${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getPost();
      message.success("Đã xoá!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const columns = [
    {
      title: "Tên bài đăng",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Ảnh minh hoạ",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (text: string, record: any, index: number) => {
        return (
          <Image
            src={process.env.REACT_APP_API_PUBLIC_BUCKET + "/" + record.cover}
            fallback={process.env.REACT_APP_API_BASE_URL + "/ImgError.png"}
          />
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: "7%",
      render: (text: string, record: any, index: number) => {
        return record.category && <span>{record.category.name}</span>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      with: "20%",
    },
    {
      title: "Ngày tạo - cập nhật gần nhất",
      key: "createAt",
      width: "15%",
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
      width: "10%",
      render: (text: any, record: any) => {
        if (deleted == "all") {
          return (
            <Space size="small">
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedPost(record);
                    setFileList([]);
                    console.log(record.cover);
                    if (record.cover) {
                      setFileListUpdate([
                        {
                          uid: record.cover?.split("/").pop(),
                          name: record.cover?.split("-").pop(),
                          status: "done",
                          url:
                            process.env.REACT_APP_API_PUBLIC_BUCKET +
                            "/" +
                            record.cover,
                        },
                      ]);
                    }
                    if (record.content) setContentUpdate(record.content);
                    updateForm.setFieldsValue(record);
                  }}
                />
              </Tooltip>
              <Tooltip title="Xoá">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(record.postId)}
                />
              </Tooltip>
            </Space>
          );
        } else {
          return (
            <Space size="small">
              <Tooltip title="Khôi phục">
                <Button
                  type="primary"
                  icon={<UndoOutlined />}
                  onClick={() => handleRestore(record.postId)}
                />
              </Tooltip>
              <Tooltip title="Xóa Vĩnh viễn">
                <Popconfirm
                  title="Chắc chắn muốn xóa vĩnh viễn?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => {
                    handleDelete(record.postId);
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

  const checkNameUnique = debounce(
    async (cb: any, value: string, ignore?: string) => {
      try {
        await axiosClient.get(
          `/posts/check/unique?field=name&value=${value}&ignore=${ignore}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        cb(undefined);
      } catch (error) {
        cb(true);
      }
    },
    500
  );

  return (
    <div style={{ padding: 36 }}>
      <Card title="Tạo bài đăng mới" style={{ width: "100%" }}>
        <Form
          form={createForm}
          name="create-post"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên bài đăng"
            name="name"
            rules={[
              { required: true, message: "Tên bài đăng là bắt buộc!" },
              {
                validator(rule, value, callback) {
                  checkNameUnique(callback, value);
                },
                message: "Tên bài đăng đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: "Danh mục là bắt buộc!" }]}
            hasFeedback
          >
            <Select>
              {categories &&
                categories?.map((value: any) => {
                  console.log(value);
                  if (value.children) {
                    return value.children.map((item: any) => {
                      return (
                        <Option value={item.categoryId}>
                          {value.name} {">"} {item.name}
                        </Option>
                      );
                    });
                  }
                })}
            </Select>
          </Form.Item>

          <Form.Item name="statusId" label="Trạng thái" hasFeedback>
            <Select options={[]} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Ảnh bìa"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && [e.file])}
          >
            <Upload
              multiple
              maxCount={1}
              accept="image/*"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={(file) => false}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item label="Nội dung">
            <CKEditor
              editor={ClassicEditor}
              data={content}
              config={{
                extraPlugins: [uploadAdapterPlugin],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
                console.log("Editor data:", data);
              }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={waitting}>
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        title={
          <Space>
            Danh sách bài đăng
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
        <Table dataSource={post} columns={columns} />
      </Card>

      <Modal
        width={1200} // Điều chỉnh chiều rộng của modal
        centered
        title="Chỉnh sửa bài đăng"
        open={selectedPost}
        okText="Cập nhật"
        confirmLoading={waitting}
        cancelText="Huỷ"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedPost(null);
          setFileList([]);
          setFileListUpdate([]);
          setCover(null);
        }}
      >
        <Form
          form={updateForm}
          name="update-post"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 24 }}
          onFinish={onUpdate}
        >
          <Form.Item
            label="Tên bài đăng"
            name="name"
            rules={[
              { required: true, message: "Tên bài đăng là bắt buộc!" },
              {
                validator(rule, value, callback) {
                  checkNameUnique(callback, value, selectedPost.name);
                },
                message: "Tên bài đăng đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: "Danh mục là bắt buộc!" }]}
            hasFeedback
          >
            <Select>
              {categories &&
                categories?.map((value: any) => {
                  console.log(value);
                  if (value.children) {
                    return value.children.map((item: any) => {
                      return (
                        <Option value={item.categoryId}>
                          {value.name} {">"} {item.name}
                        </Option>
                      );
                    });
                  }
                })}
            </Select>
          </Form.Item>

          <Form.Item name="statusId" label="Trạng thái" hasFeedback>
            <Select options={[]} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Ảnh bìa"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && [e.file])}
          >
            <Upload
              multiple
              maxCount={1}
              accept="image/*"
              listType="picture-card"
              fileList={fileListUpdate}
              onPreview={handlePreview}
              onChange={handleChangeUpdate}
              beforeUpload={(file) => false}
            >
              {fileListUpdate.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item label="Nội dung">
            <CKEditor
              editor={ClassicEditor}
              data={contentUpdate}
              config={{
                extraPlugins: [uploadAdapterPlugin],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContentUpdate(data);
                console.log("Editor data:", data);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

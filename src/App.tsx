import './App.css';
import 'antd/dist/reset.css';
import { Table, Button, Input, Space, Modal, Form } from 'antd';
import { DeleteOutlined ,EditOutlined,FileAddOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getPosts, addPost, editPost, deletePost } from './components/Apis';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editPostData, setEditPostData] = useState<Post | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    if (newPost.title.trim() && newPost.body.trim()) {
      const addedPost = await addPost(newPost);
      setPosts((prev) => [addedPost, ...prev]);
      setNewPost({ title: '', body: '', userId: 1 });
      setIsAddModalVisible(false);
    }
  };

  const openEditModal = (post: Post) => {
    setEditPostData(post);
    setIsEditModalVisible(true);
  };

  const handleUpdatePost = async () => {
    if (editPostData && editPostData.title.trim() && editPostData.body.trim()) {
      const updated = await editPost(editPostData.id, {
        title: editPostData.title,
        body: editPostData.body,
      });
      setPosts((prev) =>
        prev.map((post) => (post.id === updated.id ? updated : post))
      );
      setEditPostData(null);
      setIsEditModalVisible(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: async () => {
        await deletePost(id);
        setPosts((prev) => prev.filter((post) => post.id !== id));
      },
      onCancel: () => {
        console.log('Delete action cancelled');
      },
    });
  };
  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',

    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      align: 'center',

    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
      align: 'center', 

    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',

      render: (_: any, record: Post) => (
        <Space>
          <Button type="primary"
           style={{
            backgroundColor: '#2196F3', // Blue color
            borderColor: '#2196F3',
            fontWeight: 'bold',
          }} onClick={() => openEditModal(record)}
          icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDeletePost(record.id)}
            style={{
              fontWeight: 'bold',
              backgroundColor: '#f44336', // Red color
              borderColor: '#f44336',
            }}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Posts Management</h1>

      {/* Add Post Button */}
      <Button
        type="primary"
        onClick={() => setIsAddModalVisible(true)}
        style={{
          marginTop: '60px',
          backgroundColor: '#4CAF50', // Green color
          borderColor: '#4CAF50',
          fontWeight: 'bold',
        }}
        icon={<FileAddOutlined />}
      >
        Add New Post
      </Button>

      {/* Posts Table */}
      <Table
        columns={columns}
        dataSource={posts}
        rowKey={(record) => record.id.toString()}
        bordered
        style={{ marginTop: '20px' }} 
        pagination={{
          position: ['bottomCenter'],
          style: { display: 'flex', justifyContent: 'center',    }, 
        }}
      />

      {/* Add Modal */}
      <Modal
        title="Add New Post"
        visible={isAddModalVisible}
        onOk={handleAddPost}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
        icon={<FileAddOutlined />}
      >
        <Form layout="vertical">
          <Form.Item label="Title">
            <Input
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Body">
            <Input.TextArea
              placeholder="Body"
              value={newPost.body}
              rows={4}
              onChange={(e) =>
                setNewPost({ ...newPost, body: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Post"
        visible={isEditModalVisible}
        onOk={handleUpdatePost}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditPostData(null);
        }}
        okText="Save"
        cancelText="Cancel"
      >
        {editPostData && (
          <Form layout="vertical">
            <Form.Item label="Title">
              <Input
                value={editPostData.title}
                onChange={(e) =>
                  setEditPostData({ ...editPostData, title: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Body">
              <Input.TextArea
                value={editPostData.body}
                rows={4}
                onChange={(e) =>
                  setEditPostData({ ...editPostData, body: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default App;

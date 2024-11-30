import axios from 'axios';
import { notification } from 'antd';

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleError(error);
    return Promise.reject(error);
  }
);

// Define the Post type
interface Post {
  id?: number; 
  title: string;
  body: string;
  userId: number;
}

// GET: Fetch all posts
export async function getPosts(): Promise<Post[]> {
  const response = await axiosInstance.get<Post[]>('/posts');
  console.log(response);
  return response.data;
}


export async function addPost(post: Omit<Post, 'id'>): Promise<Post> {
  const response = await axiosInstance.post<Post>('/posts', post);
  console.log(response);
  return response.data;
}


export async function editPost(id: number, post: Partial<Omit<Post, 'id'>>): Promise<Post> {
  const response = await axiosInstance.put<Post>(`/posts/${id}`, post);
  console.log(response);
  return response.data;
}


export async function deletePost(id: number): Promise<void> {
  const response = await axiosInstance.delete<void>(`/posts/${id}`);
  console.log(response);
}


function handleError(error: any) {
  console.error(error);
  const statusCode = error.response?.status;
  const errorMessage =
    error.response?.data?.message || 'An unexpected error occurred';

 
  notification.error({
    message: `Error ${statusCode ? `(${statusCode})` : ''}`,
    description: errorMessage,
    duration: 5,
  });
}

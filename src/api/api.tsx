import { UserProfileParamsList, ProductParamsList } from '../types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://localhost:3000/';

// ── Token helpers ─────────────────────────────────────────────────────────────
const getToken = () => AsyncStorage.getItem('token');

const authHeaders = async (): Promise<Record<string, string>> => {
  const token = await getToken();
  const headers: Record<string, string> = { 'Cache-Control': 'no-cache' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
const Login = async (email: string, password: string) => {
  const response = await fetch(url + 'users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const res = await response.json();
  if (res.token) await AsyncStorage.setItem('token', res.token);
  return res;
};

const Register = async (name: string, email: string, password: string, phone: string) => {
  const response = await fetch(url + 'users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, phone }),
  });
  const res = await response.json();
  if (res.token) await AsyncStorage.setItem('token', res.token);
  return res;
};

// ── Users ─────────────────────────────────────────────────────────────────────
const GetUserProfile = async (id: string) => {
  const response = await fetch(url + 'users/' + id, {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.user;
};

const UpdateUserProfile = async (id: string, name: string, email: string, phone: string) => {
  const response = await fetch(url + 'users/' + id, {
    method: 'PUT',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, phone }),
  });
  const res = await response.json();
  return res;
};

// ── Products ──────────────────────────────────────────────────────────────────
const GetSellerProduct = async (id: string) => {
  const response = await fetch(url + 'product/user/' + id, {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.products;
};

const createFormData = (product: ProductParamsList) => {
  const data = new FormData();
  data.append('price', product.price);
  data.append('size', product.size);
  data.append('category', product.category);
  data.append('meeting', product.meeting);
  data.append('brand', product.brand);
  data.append('usage', product.usage);
  data.append('images', JSON.stringify(product.images.map(image => ({
    name: image.name,
    width: image.width,
    height: image.height,
  }))));
  product.images.forEach(image => {
    data.append('photo', {
      name: image.name,
      type: image.type,
      uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
    } as any);
  });
  return data;
};

const PostProduct = async (user_id: string, product: ProductParamsList) => {
  const response = await fetch(url + 'product/' + user_id, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'multipart/form-data' },
    body: createFormData(product),
  });
  const res = await response.json();
  return res;
};

const UpdateProduct = async (id: string, product: ProductParamsList) => {
  const response = await fetch(url + 'product/' + id, {
    method: 'PUT',
    headers: await authHeaders(),
    body: createFormData(product),
  });
  const res = await response.json();
  return res;
};

const DeleteProduct = async (id: string) => {
  const response = await fetch(url + 'product/' + id, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res;
};

const GetProductList = async (user_id: string, category: number) => {
  const response = await fetch(url + 'product/category/' + category + '/user/' + user_id, {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.products;
};

const GetProduct = async (product_id: string) => {
  const response = await fetch(url + 'product/' + product_id, {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.product;
};

const GetImage = (uri: string) => url + 'product/image/' + uri;

// ── Cart ──────────────────────────────────────────────────────────────────────
const AddItemToCart = async (product_id: string, user_id: string) => {
  const response = await fetch(url + 'cart/' + product_id + '/user/' + user_id, {
    method: 'PUT',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res;
};

const RemoveItemFromCart = async (product_id: string, user_id: string) => {
  const response = await fetch(url + 'cart/' + product_id + '/user/' + user_id, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res;
};

const GetCart = async (user_id: string) => {
  const response = await fetch(url + 'cart/' + user_id, {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.cart;
};

// ── Chat ──────────────────────────────────────────────────────────────────────
const GetRooms = async (user_id: string) => {
  const response = await fetch(url + 'rooms/user/' + user_id, {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.rooms;
};

const CreateRoom = async (buyer_id: string, seller_id: string, product_id: string) => {
  const response = await fetch(url + 'rooms', {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyer_id, seller_id, product_id }),
  });
  const res = await response.json();
  return res.room;
};

const GetMessages = async (room_id: string) => {
  const response = await fetch(url + 'rooms/' + room_id + '/messages', {
    method: 'GET',
    headers: await authHeaders(),
  });
  const res = await response.json();
  return res.messages;
};

// ── Payments ──────────────────────────────────────────────────────────────────
const CreatePaymentIntent = async (amount: number) => {
  const response = await fetch(url + 'payments/intent', {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  const res = await response.json();
  return res; // { clientSecret, publishableKey }
};

const ConfirmPayment = async (product_ids: string[], user_id: string) => {
  const response = await fetch(url + 'payments/confirm', {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_ids, user_id }),
  });
  const res = await response.json();
  return res;
};

export {
  Login,
  Register,
  GetUserProfile,
  UpdateUserProfile,
  GetSellerProduct,
  PostProduct,
  UpdateProduct,
  DeleteProduct,
  GetProductList,
  GetProduct,
  AddItemToCart,
  RemoveItemFromCart,
  GetCart,
  GetImage,
  GetRooms,
  CreateRoom,
  GetMessages,
  CreatePaymentIntent,
  ConfirmPayment,
};

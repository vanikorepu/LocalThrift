import {UserProfileParamsList, ProductParamsList} from '../type';
import {Platform} from 'react-native';

const url = 'http://34.122.140.194:3000/';

const Login = async (email: string, password: string) => {
  const response = await fetch(url + 'users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email: email, password: password}),
  });
  const res = await response.json();
  return res;
};

const GetCode = async (email: string) => {
  const response = await fetch(url + 'users/verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email
    }),
  });
  const res = await response.json();
  return res;
};

const Register = async (
  name: string,
  email: string,
  password: string,
  phone: string,
) => {
  const response = await fetch(url + 'users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
      name: name,
      phone: phone,
    }),
  });
  const res = await response.json();
  return res;
};

const GetUserProfile = async (id: string): Promise<UserProfileParamsList> => {
  const response = await fetch(url + 'users/' + id, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const res = await response.json();
  return res.user;
};

const UpdateUserProfile = async (
  id: string,
  name: string,
  email: string,
  phone: string,
) => {
  const response = await fetch(url + 'users/' + id, {
    method: 'PUT',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email: email, name: name, phone: phone}),
  });
  const res = await response.json();
  return res;
};

const GetSellerProduct = async (id: string): Promise<ProductParamsList[]> => {
  const response = await fetch(url + 'product/user/' + id, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
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
  data.append(
    'images',
    JSON.stringify(
      product.images.map(image => {
        return {
          name: image?.name,
          width: image?.width,
          height: image?.height,
        };
      }),
    ),
  );
  product.images.map((image, index) => {
    data.append('photo', {
      name: image?.name,
      type: image?.type,
      uri: Platform.OS === 'ios' ? image?.uri?.replace('file://', '') : image?.uri,
    });
  });
  return data;
};

const PostProduct = async (user_id: string, product: ProductParamsList) => {
  const response = await fetch(url + 'product/' + user_id, {
    method: 'POST',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'multipart/form-data',
    },
    body: createFormData(product),
  });
  const res = await response.json();
  return res;
};

const UpdateProduct = async (id: string, product: ProductParamsList) => {
  const response = await fetch(url + 'product/' + id, {
    method: 'PUT',
    headers: {
      'Cache-Control': 'no-cache',
    },
    body: createFormData(product),
  });
  const res = await response.json();
  return res;
};

const DeleteProduct = async (id: string) => {
  const response = await fetch(url + 'product/' + id, {
    method: 'DELETE',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const res = await response.json();
  return res;
};

const GetProductList = async (user_id: string, category: number): Promise<ProductParamsList[]> => {
  const response = await fetch(
    url + 'product/category/' + category + '/user/' + user_id,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    },
  );
  const res = await response.json();
  return res.products;
};

const GetProduct = async (product_id: string): Promise<ProductParamsList> => {
  const response = await fetch(url + 'product/' + product_id, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const res = await response.json();
  return res.product;
};

const AddItemToCart = async (product_id: string, user_id: string) => {
  const response = await fetch(
    url + 'cart/' + product_id + '/user/' + user_id,
    {
      method: 'PUT',
      headers: {
        'Cache-Control': 'no-cache',
      },
    },
  );
  const res = await response.json();
  return res;
};

const RemoveItemFromCart = async (product_id: string, user_id: string) => {
  const response = await fetch(
    url + 'cart/' + product_id + '/user/' + user_id,
    {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
      },
    },
  );
  const res = await response.json();
  return res;
};

const GetCartCount = async (user_id: string) => {
  const response = await fetch(url + 'cart/' + user_id + '/count', {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const res = await response.json();
  return res.count;
}

const GetCart = async (user_id: string) => {
  const response = await fetch(url + 'cart/' + user_id, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  const res = await response.json();
  return res.cart;
};

const GetImage = (uri: string) => {
  return url + 'product/image/' + uri;
};

export {
  Login,
  Register,
  GetCode,
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
  GetCartCount,
  GetCart,
  GetImage,
};

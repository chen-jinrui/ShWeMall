import axios from 'axios';
import qs from 'Qs';
import { Dialog, Toast } from 'vant';

const instance = axios.create({
  timeout: 5000,
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : ''
});

instance.interceptors.request.use((config) => {
  !config.hideLoading && Toast.loading({ mask: true });
  if (config.method === 'post' || config.method === 'put') {
    config.data = qs.stringify(config.data);
  }
  if (!config.headers.Authorization) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('Authorization') || '';
  }
  return config;
}, (err) => {
  return Promise.reject(err);
});

instance.interceptors.request.use(config => {
  console.log(1);
  return config;
});

instance.interceptors.response.use((res) => {
  Toast.clear();
  if (!res.data.success) {
    switch (res.data.code) {
      case 422:
        var flag = Array.isArray(res.data.data) && res.data.data.length;
        Dialog.alert({
          message: flag
            ? res.data.data[0].message
            : res.data.message
        });
        break;
      case 401:
        break;
      case 404:
        break;
    }
    return Promise.reject(res);
  }
  return res;
}, (error) => {
  Dialog.alert({ title: '警告', message: error.message });
  return Promise.reject(error);
});

const post = (url, data, config = {}) => {
  return instance.post(url, data, config);
};

const put = (url, data, config = {}) => {
  return instance.put(url, data, config);
};

const get = (url, params, config = {}) => {
  return instance.get(url, {
    params: params,
    ...config
  });
};

const deleteMethod = (url, config = {}) => {
  return instance({
    url: url,
    method: 'delete',
    ...config
  });
};

export default {
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      $reqGet: {
        value: get
      },
      $reqPost: {
        value: post
      },
      $reqPut: {
        value: put
      },
      $reqDel: {
        value: deleteMethod
      }
    });
  }
};

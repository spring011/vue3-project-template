// request.ts
import axios, { AxiosRequestConfig } from 'axios';
import NProgress from 'nprogress';

// const config = import.meta.env.VITE_USER_NODE_ENV
// const url = import.meta.env.VITE_APP_BADGEAPI_URL;

// 设置请求头和请求路径
// axios.defaults.baseURL = config==='development'?'':url;
axios.defaults.baseURL = '';
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.interceptors.request.use(
  (config): AxiosRequestConfig<any> => {
    const pConfig = config;
    const token = window.sessionStorage.getItem('token');
    if (token) {
      // @ts-ignore
      pConfig.headers.token = token;
    }
    return pConfig;
  },
  (error) => {
    return error;
  }
);
// 响应拦截
axios.interceptors.response.use((res) => {
  if (res.data.code === 111) {
    sessionStorage.setItem('token', '');
    // token过期操作
  }
  return res;
});
export type ResPageInfo = {
  pageNum: number;
  pageSize: number;
  pageTotal: number;
  total: number;
};
export interface R {
  code: number;
  msg: string;
  err: string;
  message?: string;
  success?: boolean;
}
export interface ResType<T> extends R {
  data?: T;
}
export type ListKeyEnum = 'recordList';
export interface ResList extends R {
  data: {
    // eslint-disable-next-line no-unused-vars
    [k in ListKeyEnum]: unknown[];
  } & {
    pageInfo: ResPageInfo;
  };
}
interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>;
  post<T>(url: string, params?: unknown): Promise<ResType<T>>;
  upload<T>(url: string, params: unknown): Promise<ResType<T>>;
  download(url: string): void;
}

const http: Http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      axios
        .get(url, { params })
        .then((res) => {
          NProgress.done();
          resolve(res.data);
        })
        .catch((err) => {
          NProgress.done();
          reject(err.data);
        });
    });
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      axios
        .post(url, JSON.stringify(params))
        .then((res) => {
          NProgress.done();
          resolve(res.data);
        })
        .catch((err) => {
          NProgress.done();
          reject(err.data);
        });
    });
  },
  upload(url, file) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      axios
        .post(url, file, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          NProgress.done();
          resolve(res.data);
        })
        .catch((err) => {
          NProgress.done();
          reject(err.data);
        });
    });
  },
  download(url) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.onload = function () {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },
};
export { axios };
export default http;

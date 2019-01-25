import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('rxToken');
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTU0ODM4NjA5OSwiZXhwIjoxNTUwOTc4MDk5fQ.FAYhpZTVyN_fxrndFMb31Hyv4SNxsMrAH03E87gL-Y0';
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => {
    // const { status } = error.response;
    console.error(`接口:${error.config.url}异常 --- ${error.message}`);
    return Promise.resolve(false);
  }
);

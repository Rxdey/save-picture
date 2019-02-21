import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('rxToken');
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTU0ODYzODE4MCwiZXhwIjoxNTUxMjMwMTgwfQ.jT5v-h7J27vNrcDNVMuE59PiG8MpeI9F-bjmTwKnLIM';
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
    // console.log(error.response)
    return Promise.resolve(error.response.data.code);
  }
);

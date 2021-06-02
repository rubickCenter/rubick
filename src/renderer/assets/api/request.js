import axios from 'axios';
import config from "./config";

const instance = axios.create({
  baseURL: config[process.env.NODE_ENV],
  timeout: 10000,
  withCredentials: true
});

export default instance;

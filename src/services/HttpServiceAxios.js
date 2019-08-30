import axios from 'axios';
import env from 'utils/env';

class HttpServices {
  // eslint-disable-next-line class-methods-use-this
  get headers() {
    const h = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    return h;
  }

  get = (url, params) => {
    const options = {
      url: `${env.API_URL}${url}`,
      method: 'get',
      headers: { ...this.headers },
      params
    };
    return axios(options);
  }

  post = (url, data) => {
    const options = {
      url: `${env.API_URL}${url}`,
      method: 'post',
      headers: this.headers,
      data
    };
    return axios(options);
  }
}

const httpServices = new HttpServices();
export default httpServices;

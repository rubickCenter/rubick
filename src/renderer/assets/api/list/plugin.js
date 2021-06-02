import instance from '../request';

export default {
  async add(params) {
    const result = await instance.post('/plugin/create', params);
    return result.data;
  },
  async update(params) {
    const result = await instance.post('/plugin/update', params);
    return result.data;
  },
  async query(params) {
    const result = await instance.get('/plugin/query', {params});
    return result.data;
  }
}

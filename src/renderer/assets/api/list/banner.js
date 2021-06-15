import instance from '../request';

export default {
  async query(params) {
    const result = await instance.get('/banner/query', {params});
    return result.data;
  }
}

import fetchClient from './fetchClient.js';
import AppConstants from '../appConstants.js';
import utils from '../utils.js';

export default class BaseApi {
  getResourceName() {
    throw new Error('Please implement this method');
  }

  getAll(obj) {
    const str = `_page=${obj._page}&_limit=${obj._limit}`;
    //const str = utils.urlString(obj);
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/?${str}`;
    return fetchClient.get(url);
  }

  getDetail(id) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${id}`;
    return fetchClient.get(url);
  }

  add(payload) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}`;
    return fetchClient.post(url, payload);
  }

  update(payload) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${payload.id}`;
    return fetchClient.patch(url, payload);
  }

  remove(id) {
    const url = `${AppConstants.API_URL}/${this.getResourceName()}/${id}`;
    return fetchClient.delete(url);
  }
}
import BaseApi from "./baseApi.js";

class CommentApi extends BaseApi {
  getResourceName() {
    return 'comments';
  }
}

const commentApi = new CommentApi();
export default commentApi;
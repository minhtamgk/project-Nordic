import postApi from './api/postApi.js';
import utils from './utils.js';

const renderPost = (post) => {
  console.log('Post: ', post);

  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
  utils.setTextByElementId('postDetailTitle', post.title);
  utils.setTextByElementId('postDetailAuthor', post.author);
  utils.setTextByElementId('postDetailDescription', post.description);

  const dateString = utils.formatDate(post.createdAt);
  utils.setTextByElementId('postDetailTimeSpan', dateString);
};

const renderEditLink = (post) => {
  const editLink = document.querySelector('#goToEditPageLink');
  if (editLink) {
    editLink.href = `add-edit-post.html?postId=${post.id}`;
    editLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
};

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  try {
    // Retrieve postId from query params
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    if (!postId) return;

    const post = await postApi.getDetail(postId);
    renderPost(post);
    renderEditLink(post);
  } catch (error) {
    console.log(error);
  }
};

init();
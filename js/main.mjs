'use strict';
import AppConstants from './appConstants.js';
import postApi from './api/postApi.js';
import utils from './utils.js';

const handleEditButton = (post) => {
  window.location = `add-edit-post.html?postId=${post.id}`;
}

const handleRemovePost = (liElement) => {
  const postListElement = document.querySelector('#postsList');
  const confirmMessage = 'You\'re going delete this post. really?';
  if (window.confirm(confirmMessage)) {
    postListElement.removeChild(liElement);
    postApi.remove(post.id);
  }

}

const buildLiElement = (post) => {
  const templateElement = utils.getElementById('postItemTemplate');
  const templteFragment = templateElement.content.cloneNode(true);
  const liElement = templteFragment.querySelector('li');
  if (liElement) {
    const imgElement = liElement.querySelector('#postItemImage');
    if (imgElement) {
      imgElement.src = post.imageUrl;
    }

    const titleElement = liElement.querySelector('#postItemTitle');
    if (titleElement) {
      titleElement.innerText = post.title;
    }

    const desElement = liElement.querySelector('#postItemDescription');
    if (desElement) {
      desElement.innerText = utils.truncateTextlength(post.description, 50);
    }

    const postElement = liElement.querySelector('#goToDetailPageLink');
    if (postElement) {
      postElement.href = `post-detail.html?postId=${post.id}`;
    }

    const editPost = liElement.querySelector('#postItemEdit');
    if (editPost) {
      editPost.addEventListener('click', () => handleEditButton(post));
    }

    const removePost = liElement.querySelector('#postItemRemove');
    if (removePost) {
      removePost.addEventListener('click', () => handleRemovePost(liElement));
    }
  }
  return liElement;
}

// -----------------------
// MAIN LOGIC
// -----------------------

const removeAttrClass = (liPaginationList) => {
  for (const liElement of liPaginationList) {
    liElement.classList.remove('active');
  }
}

const activeCurPage = (liPaginationList, maxPage) => {
  const params = new URLSearchParams(window.location.search);
  const curPage = Number(params.get('_page'));
  if (curPage === 1 || !curPage) {
    liPaginationList[1].classList.add('active');
  } else if (curPage === maxPage) {
    if (curPage > 2) {
      liPaginationList[3].classList.add('active');
    } else {
      liPaginationList[2].classList.add('active');
    }
  } else {
    liPaginationList[2].classList.add('active');
  }
}

const setHrefNotCurPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = 1;
  if (objValidate.maxPage > 0) {
    aPaginationList[1].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[1].removeAttribute('hidden');
    aPaginationList[1].innerText = page;
  }

  if (objValidate.maxPage > 1) {
    aPaginationList[2].href = `index.html?_page=${page + 1}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page + 1;
    aPaginationList[3].href = `index.html?_page=${page + 1}&_limit=6`;
    liPaginationList[4].classList.remove('disabled');
  }

  if (objValidate.maxPage > 2) {
    aPaginationList[3].href = `index.html?_page=${page + 2}&_limit=6`;
    aPaginationList[3].removeAttribute('hidden');
    aPaginationList[3].innerText = page + 2;
    aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;
    liPaginationList[4].classList.remove('disabled');
  }
}

const setHrefAtMaxPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = objValidate.curPage;

  if (objValidate.maxPage > 1) {
    aPaginationList[2].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page;
    aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
    liPaginationList[0].classList.remove('disabled');
    liPaginationList[4].classList.add('disabled');
  }

  if (objValidate.maxPage > 2) {
    aPaginationList[3].href = `index.html?_page=${page}&_limit=6`;
    aPaginationList[3].removeAttribute('hidden');
    aPaginationList[3].innerText = page;

    aPaginationList[2].href = `index.html?_page=${page - 1}&_limit=6`;
    aPaginationList[2].removeAttribute('hidden');
    aPaginationList[2].innerText = page - 1;

    aPaginationList[1].href = `index.html?_page=${page - 2}&_limit=6`;
    aPaginationList[1].removeAttribute('hidden');
    aPaginationList[1].innerText = page - 2;

    aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
    liPaginationList[0].classList.remove('disabled');
    liPaginationList[4].classList.add('disabled');
  }
};

const setHrefMidMaxPage = (aPaginationList, liPaginationList, objValidate) => {
  const page = objValidate.curPage;

  aPaginationList[3].href = `index.html?_page=${page + 1}&_limit=6`;
  aPaginationList[3].removeAttribute('hidden');
  aPaginationList[3].innerText = page + 1;
  //aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;

  aPaginationList[2].href = `index.html?_page=${page}&_limit=6`;
  aPaginationList[2].removeAttribute('hidden');
  aPaginationList[2].innerText = page;

  aPaginationList[1].href = `index.html?_page=${page - 1}&_limit=6`;
  aPaginationList[1].removeAttribute('hidden');
  aPaginationList[1].innerText = page - 1;

  aPaginationList[0].href = `index.html?_page=${page - 1}&_limit=6`;
  aPaginationList[4].href = `index.html?_page=${page + 1}&_limit=6`;

  liPaginationList[0].classList.remove('disabled');
  liPaginationList[4].classList.remove('disabled');
}

const renderPagination = async (maxPage) => {
  try {
    let newPostList = null;
    const params = new URLSearchParams(window.location.search);
    const curPage = Number(params.get('_page'));
    const aPaginationList = document.querySelectorAll('a.page-link');
    const liPaginationList = document.querySelectorAll('li.page-item');
    const objValidate = {
      curPage: curPage,
      maxPage: maxPage,
    };

    if (maxPage < 1) return;
    else {
      if (!curPage || curPage === 1) {
        removeAttrClass(liPaginationList);
        setHrefNotCurPage(aPaginationList, liPaginationList, objValidate);
        newPostList = (await postApi.getAll({
          _page: 1,
          _limit: 6
        })).data;
        activeCurPage(liPaginationList, maxPage);
      } else if (curPage === maxPage) {
        removeAttrClass(liPaginationList);
        setHrefAtMaxPage(aPaginationList, liPaginationList, objValidate);
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get('_page'));
        newPostList = (await postApi.getAll({
          _page: page,
          _limit: 6
        })).data;
        activeCurPage(liPaginationList, maxPage);
      } else {
        removeAttrClass(liPaginationList);
        setHrefMidMaxPage(aPaginationList, liPaginationList, objValidate);
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get('_page'));
        newPostList = (await postApi.getAll({
          _page: page,
          _limit: 6
        })).data;
        activeCurPage(liPaginationList, maxPage);
      }


    }
    return newPostList;
  } catch (error) {
    throw error;
  }
};


const init = async () => {
  try {
    const postList = await postApi.getAll({
      _page: '',
      _limit: ''
    });
    const maxPage = Math.ceil(postList.length / 6);
    const newPostList = await renderPagination(maxPage);

    const ulPostList = utils.getElementById('postsList');
    if (ulPostList) {
      for (const post of newPostList) {
        const liElement = buildLiElement(post);
        ulPostList.appendChild(liElement);
      }
    }
  } catch (error) {
    console.log(error);
  }


};

init();
// add or edit
//add: 
// random banner
//handle submit
//handle drag img click
//edit:
//get post by postId
//fill Data
//handle submit
//handle drag img click
import utils from './utils.js';
import postApi from './api/postApi.js'
const randomNumber = () => {
    const temp = Math.trunc(Math.random() * (2000 - 100));
    return 100 + temp;
};

const randomBannerImage = () => {
    const randomId = randomNumber();
    const bannerUrl = `https://picsum.photos/id/${randomId}/1368/400`;
    utils.setBackgroundImageByElementId('postHeroImage', bannerUrl);
};

const getPostFormValues = () => {
    return {
        title: utils.getValueByElementId('postTitle'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
    };
};

const setFormValues = (herPost) => {
    utils.setValueByElementId('postTitle', herPost.title);
    utils.setValueByElementId('postAuthor', herPost.author);
    utils.setValueByElementId('postDescription', herPost.description);
    utils.setBackgroundImageByElementId('postHeroImage', herPost.imageUrl)
}



const validatePostForm = (formValues) => {
    let isValid = true;
    //check title && author
    if (formValues.title.trim() === '') {
        isValid = false;
        utils.addClassByElementId('postTitle', ['is-invalid']);
        utils.addClassByElementId('postAuthor', ['is-invalid']);
    }
    return isValid;
};

const resetValidationErrors = () => {
    utils.removeClassByElementId('postTitle', ['is-invalid']);
    utils.removeClassByElementId('postAuthor', ['is-invalid']);
};

const updateNewPost = (herPost, newPost) => {
    herPost.title = newPost.title;
}



const handlePostFormSubmit = async (e, postId) => {
    e.preventDefault();
    resetValidationErrors();

    const formValues = getPostFormValues();
    if (!postId) {
        const isValid = validatePostForm(formValues);
        if (!isValid) return;
        //get form value

        // call API to create a new post
        try {
            const post = await postApi.add(formValues);

            //     //inform user: post created
            alert('Add new post successfully');
            //     //Redirect edit mode
            const editPostUrl = `add-edit-post.html?postId=${post.id}`;
            window.location = editPostUrl;
        } catch (error) {
            alert(`failed to add new post: ${error}`);
        }
    } else {
        try {
            const herPost = await postApi.getDetail(postId);
            if (herPost.title !== formValues.title || herPost.title !== formValues.title) {
                const isValid = validatePostForm(formValues);
                if (!isValid) return;
            }
            updateNewPost(herPost, newPost);
            await postApi.update(herPost);
            // If update successfully, show an alert with message Save post successfully.
            alert('update new post successly');
        } catch (error) {
            throw error;
        }
    }
};

//MAIN LOGIC    
const main = async () => {

    try {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('postId');
        const mode = postId ? 'edit' : 'add';
        if (mode === 'add') {
            //random banner image
            randomBannerImage();
        } else {
            //edit mode
            //fetch post
            const herPost = await postApi.getDetail(postId);
            setFormValues(herPost);
        };

        //bind event: form submit + change banner img

        const postForm = document.querySelector('#postForm');
        if (postForm) {
            postForm.addEventListener('submit', handlePostFormSubmit);
        };

        const changePostBannerButton = document.querySelector('#postChangeImage');
        if (changePostBannerButton) {
            changePostBannerButton.addEventListener('click', randomBannerImage);
        };
    } catch (error) {
        throw error;
    }
};
main();
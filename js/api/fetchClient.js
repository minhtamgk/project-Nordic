// get data from server by function request
const request = async (url, options) => {
  try {
    const requestOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json'
      },
    };

    // Fetch data
    const response = await fetch(url, requestOptions);

    // Check if success
    if (response.status >= 200 && response.status < 300) {
      // response.json().then(data => console.log(data));
      const data = await response.json();
      return data;
    }

    // Handle error
    const error = new Error(response.status);
    throw error;
  } catch (error) {
    throw error;
  }
};

const get = (url, params) => request(url, {
  method: 'GET'
});

const post = (url, body) => request(url, {
  body: JSON.stringify(body),
  method: 'POST'
});

const patch = (url, body) => request(url, {
  body: JSON.stringify(body),
  method: 'PATCH'
});

const deleteRequest = (url) => request(url, {
  method: 'DELETE'
});

const fetchClient = {
  get,
  post,
  patch,
  delete: deleteRequest,
};
export default fetchClient;
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://7a587ab63e8f.ngrok.io/sgbarber-api'
});

export default api;

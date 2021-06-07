import axios from 'axios';

export const API_URL = window.location.host.includes('localhost') ? 'http://localhost:5000' : 'https://apihalomentor.pprqsirau.com'

const token = localStorage.getItem('hm_token')
const instance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {'Authorization': 'Bearer '+token}
});

export default instance;

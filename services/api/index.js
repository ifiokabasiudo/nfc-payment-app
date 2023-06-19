// api.js
import Axios from "axios";

let urls = {
    test: `https://nfc-payment-api.vercel.app/`,
    development: 'http://localhost:4000/',
    production: 'https://nfc-payment-api.vercel.app/'
}
const api = Axios.create({
    baseURL: urls[process.env.NODE_ENV],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default api;
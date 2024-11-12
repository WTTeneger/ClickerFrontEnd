let isProd = process.env.NODE_ENV === 'production';
let API_BASE_URL = isProd ? 'https://api.mellstroycoin.tech/api' : 'http://localhost:3030/api';

// const API_BASE_URL = 'http://localhost:3030/api';
// const API_BASE_URL = 'http://localhost:3030/api';
// const API_BASE_URL = 'http://192.168.0.133:3030/api';
API_BASE_URL = 'https://api.mellstroycoin.tech/api';

export const MAX_ENERGY = 5000;


export default API_BASE_URL;

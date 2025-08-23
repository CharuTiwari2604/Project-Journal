// import axios from 'axios';

// const api = axios.create({
//   //  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
//   //  baseURL: import.meta.env.VITE_API_URL || "https://project-journal-nrgb.onrender.com/api",
//    baseURL: import.meta.env.VITE_API_URL || " ",
   
//   withCredentials: true,
// });

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
import axios from "axios";

// Membuat instance Axios dengan Base URL dari .env
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Fungsi yang akan otomatis berjalan SEBELUM request dikirim ke backend
axiosInstance.interceptors.request.use(
  (config) => {
    // Cek apakah ada token yang tersimpan di localStorage (browser)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Jika ada token, otomatis tempelkan di header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;

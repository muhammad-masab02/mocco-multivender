import axios from "axios";

// Enable credentials on all requests by default
axios.defaults.withCredentials = true;

// Request interceptor: attach tokens as Authorization and custom headers
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    try {
      const adminToken = localStorage.getItem("admin_token");
      const userToken = localStorage.getItem("user_token");
      const sellerToken = localStorage.getItem("seller_token");

      if (adminToken) {
        config.headers["admin_token"] = adminToken;
      }
      if (userToken) {
        config.headers["user_token"] = userToken;
      }
      if (sellerToken) {
        config.headers["seller_token"] = sellerToken;
      }

      // Determine best bearer token based on URL context
      const url = config.url || "";
      let primaryToken = null;
      if (url.includes("/admin")) {
        primaryToken = adminToken || userToken;
      } else if (url.includes("/shop") || url.includes("/seller")) {
        primaryToken = sellerToken;
      } else {
        primaryToken = userToken || adminToken;
      }

      if (primaryToken && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${primaryToken}`;
      }
    } catch {
      // Ignore localStorage access errors if storage is disabled
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;

import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: "https://api.gfycat.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      config.headers["Authorization"] = 'Bearer ' + token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      if (TokenService.getLocalRefreshToken()) {
        try {
          const rs = await instance.post("/oauth/token", {
            "grant_type": "refresh",
            "client_id": process.env.REACT_APP_GFYCAT_CLIENT_ID,
            "client_secret": process.env.REACT_APP_GFYCAT_CLIENT_SECRET,
            "refresh_token": TokenService.getLocalRefreshToken(),
          });
          const { access_token, refresh_token } = rs.data;
          const gif = { accessToken: access_token, refreshToken: refresh_token }
          TokenService.setGif(gif);
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
      else {
        try {
          const rs = await instance.post("/oauth/token", {
            "grant_type": "password",
            "client_id": process.env.REACT_APP_GFYCAT_CLIENT_ID,
            "client_secret": process.env.REACT_APP_GFYCAT_CLIENT_SECRET,
            "username": process.env.REACT_APP_GFYCAT_USERNAME,
            "password": process.env.REACT_APP_GFYCAT_PASSWORD,
          }
          );
          const { access_token, refresh_token } = rs.data;
          const gif = { accessToken: access_token, refreshToken: refresh_token }
          TokenService.setGif(gif);
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);
export default instance;
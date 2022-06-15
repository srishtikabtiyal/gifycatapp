class TokenService {
  getLocalRefreshToken() {
    const gif = JSON.parse(localStorage.getItem("gif"));
    return gif?.refreshToken;
  }
  getLocalAccessToken() {
    const gif = JSON.parse(localStorage.getItem("gif"));
    return gif?.accessToken;
  }
  updateLocalAccessToken(token) {
    let gif = JSON.parse(localStorage.getItem("gif"));
    gif.accessToken = token;
    localStorage.setItem("gif", JSON.stringify(gif));
  }
  updateLocalRefreshToken(token) {
    let gif = JSON.parse(localStorage.getItem("gif"));
    gif.refreshToken = token;
    localStorage.setItem("gif", JSON.stringify(gif));
  }
  getGif() {
    return JSON.parse(localStorage.getItem("gif"));
  }
  setGif(gif) {
    console.log(JSON.stringify(gif));
    localStorage.setItem("gif", JSON.stringify(gif));
  }
  removeGif() {
    localStorage.removeItem("gif");
  }
}
export default new TokenService();
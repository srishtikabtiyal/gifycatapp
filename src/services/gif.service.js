import api from './api';
class GifService {
  getTrendingGifs() {
    return api.get('/reactions/populated?tagName=trending&count=100');
  }
  getSearchedGifs(keywords) {
    return api.get(`/gfycats/search?search_text=${keywords}&count=100`);
  }
  getTrendingTags() {
    // `/tags/trending?tagCount=20` NOT WORKING so THIS IS THE NEXT BEST OPTION
    return api.get(`/tags/trending/populated?tagCount=20&gfyCount=1`);
  }
}
export default new GifService();
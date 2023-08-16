// route to get logged in user's info (needs the token)
import axios from "axios";

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

import axios from "axios";
import { setAlert } from "./alertAction";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from "../const/actionTypes";

//Get Posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("/posts");
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//ADD LIKE
export const addLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id: postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Remove Like
export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { id: postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Remove Post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: { id: postId }
    });
    dispatch(setAlert("Post has been removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
//Add Post
export const addPost = newPost => async dispatch => {
  if (!newPost.text.trim()) {
    return dispatch(setAlert("Add a valid text to publish a post", "danger"));
  }

  try {
    const res = await axios.post(`/posts`, newPost);
    dispatch({
      type: ADD_POST,
      payload: res.data
    });
    dispatch(setAlert("Post created", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
//Get Post
export const getPostById = id => async dispatch => {
  try {
    const res = await axios.get(`/posts/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Add Comment
export const addComment = (postId, formData) => async dispatch => {
  if (!formData.text.trim()) {
    return dispatch(setAlert("Add a valid text to add a comment", "danger"));
  }

  try {
    const res = await axios.post(`/posts/comment/${postId}`, formData);
    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });
    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Remove a Comment
export const removeComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(`/posts/comment/${postId}/${commentId}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });
    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

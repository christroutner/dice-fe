/**
 *  Service to handle post requests
 */
import config from '../config'
import axios from 'axios'

const SERVER =  config.pmaServer

export const createPost = async ({ postObj , token} ) => {
  try {
    const options = {
      method: 'POST',
      url: `${SERVER}/post`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {
        post:postObj
      }
    }
    const result = await axios(options)
    console.log(`createPost() result: ${JSON.stringify(result.data, null, 2)}`);
    return result.data
  } catch (e) {
    console.warn('Error in post/createPost()', e.message)
    throw e
  }
}

export const getHydratedPosts = async (token) => {
  try {
    const options = {
      method: 'GET',
      url: `${SERVER}/post/hydrated`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
    }
    const result = await axios(options)
    return result.data
  } catch (e) {
    console.warn('Error in post/getHydratedPosts()', e.message)
    throw e
  }
}
export const getHydratedPost = async (postId, token) => {
  try {
    const options = {
      method: 'GET',
      url: `${SERVER}/post/hydrated/${postId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
    }
    const result = await axios(options)
    return result.data
  } catch (e) {
    console.warn('Error in post/getHydratedPost()', e.message)
    throw e
  }
}


export const updatePost = async ({ postId, postObj, token }) => {
  try {
    const options = {
      method: 'PUT',
      url: `${SERVER}/post/${postId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {
        post:postObj
      } 
    }
    const result = await axios(options)
    console.log(`updatePost() result: ${JSON.stringify(result.data, null, 2)}`);
    return result.data
  } catch (e) {
    console.warn('Error in post/updatePost()', e.message)
    throw e
  }
}

export const getPost = async (postId, token) => {
  try {
    const options = {
      method: 'GET',
      url: `${SERVER}/post/${postId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
    }
    const result = await axios(options)
    return result.data
  } catch (e) {
    console.warn('Error in post/getPost()', e.message)
    throw e
  }
}
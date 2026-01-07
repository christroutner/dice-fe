/**
 *  Service to handle comments requests
 */
import config from '../config'
import axios from 'axios'

const SERVER =  config.pmaServer

export const createComment = async ({ commentObj , token} ) => {
  try {
    const options = {
      method: 'POST',
      url: `${SERVER}/comment`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {
        comment:commentObj
      }
    }
    const result = await axios(options)
    console.log(`createComment() result: ${JSON.stringify(result.data, null, 2)}`);
    return result.data
  } catch (e) {
    console.warn('Error in comment/createComment()', e.message)
    throw e
  }
}

export const getCommentsByParent = async (parentId,token) => {
  try {
    const options = {
      method: 'GET',
      url: `${SERVER}/comment/parent/${parentId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
    }
    const result = await axios(options)
    return result.data
  } catch (e) {
    console.warn('Error in comment/getCommentsByParent()', e.message)
    throw e
  }
}
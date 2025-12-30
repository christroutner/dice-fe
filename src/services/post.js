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

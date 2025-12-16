/**
 *  Service to auth user
 */
import axios from 'axios'
import config from '../config'

const SERVER =  config.pmaServer
export const createUser = async ({ email, password }) => {
  // try auth
  try {
    const options = {
      method: 'POST',
      url: `${SERVER}/users`,
      headers: {
        Accept: 'application/json'
      },
      data: {
        user:{
          email,
          password,
          name:email
        }
      }
    }
    const result = await axios(options)
   
    return result.data
  } catch (e) {
    console.warn('Error in auth/createUser()', e.message)
    throw e
  }
}

export const authUser = async ({ email, password }) => {
  try {
    const options = {
      method: 'POST',
      url: `${SERVER}/auth`,
      headers: {
        Accept: 'application/json'
      },
      data: {
          email,
          password
        
      }
    }
    const result = await axios(options)
 
    return result.data
  } catch (e) {
    console.warn('Error in auth/handleLogin()', e.message)
    throw e
  }
}
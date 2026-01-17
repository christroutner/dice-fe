/**
 *  Service to upload files
 */
import axios from 'axios'
import config from '../config'
import FormData from 'form-data';

const SERVER =  config.pmaServer


export const uploadFile = async ({ file, token }) => {
  // try auth
  try {

    const form = new FormData();
    const axiosConfig ={
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    console.log('axiosConfig:', axiosConfig);
    form.append("file", file, file.name);

    const result = await axios.post(`${SERVER}/files/upload`, form, axiosConfig);
    return result.data;
  } catch (e) {
    console.warn('Error in files/uploadFile()', e.message)
    throw e
  }
}

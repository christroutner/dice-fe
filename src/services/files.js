/**
 *  Service to upload files
 */
import axios from 'axios'
import config from '../config'
import FormData from 'form-data';

const SERVER =  config.pmaServer


export const uploadFile = async ({ file, token , progressCallback}) => {
  // try auth
  try {

    const form = new FormData();
    const axiosConfig ={
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (progressCallback) {
          // Calc upload progress percent
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressCallback(percentCompleted);
        }
      },
    }
    //console.log('axiosConfig:', axiosConfig);
    form.append("file", file, file.name);

    const result = await axios.post(`${SERVER}/files/upload`, form, axiosConfig);
    return result.data;
  } catch (e) {
    console.warn('Error in files/uploadFile()', e.message)
    throw e
  }
}

export const fetchFile = async ({ url, token }) => {
  try {
    const axiosConfig ={
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob'
    }
    const result = await axios.get(url, axiosConfig);
    console.log('result', result.data);
    return result.data;
  }
  catch (e) {
    console.warn('Error in files/fetchFile()', e.message)
    throw e
  }
}

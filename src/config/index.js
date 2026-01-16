/*
  Global configuration settings for this app.
*/

const config = {

  pmaServer: process.env.REACT_APP_PMA_SERVER || 'http://localhost:5700',
  maxPostMediaFiles: process.env.REACT_APP_MAX_POST_MEDIA_FILES || 5,

}

export default config
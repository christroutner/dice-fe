// Global imports
import { useState, useEffect, useCallback } from 'react'
import { getHydratedPosts } from '../services/post';
// import { useQueryParam, StringParam } from 'use-query-params'
import useLocalStorageState from 'use-local-storage-state'
import { useNavigate } from 'react-router-dom'

function useAppState () {
  const navigate = useNavigate()

  // Load Local storage Data
  const [lsState, setLSState, { removeItem }] = useLocalStorageState('dice-storage', {
    ssr: true,
    defaultValue: {}

  })
  const [userData, setUserData] = useState(lsState.userData)
  const [loggedInAlreadyChecked, setLoggedInAlreadyChecked] = useState(false)
  const [posts, setPosts] = useState([])

  console.log('lsState: ', lsState)
 

  const removeLocalStorageItem = removeItem

  const updateLocalStorage = (lsObj) => {
    console.log(`updateLocalStorage() input: ${JSON.stringify(lsObj, null, 2)}`)

    // Progressively overwrite the LocalStorage state.
    const newObj = Object.assign({}, lsState, lsObj)
    // console.log(`updateLocalStorage() output: ${JSON.stringify(newObj, null, 2)}`)

    setLSState(newObj)
  }

  // Logout the user
  const logout = () => {
    setUserData(null)
    removeLocalStorageItem('userData')
    setLoggedInAlreadyChecked(false)
  }

  useEffect(() => {
    const verifyAuth =()=>{
         // verify if the user is logged in
         console.log('userData', userData)
    const isLoggedIn = userData && userData.token
    console.log('isLogeedIn', isLoggedIn, loggedInAlreadyChecked)

    if(loggedInAlreadyChecked) return

    if (!isLoggedIn ) {
          // if the user is not logged in, navigate to the login page
      console.log('navigating to login')
      setLoggedInAlreadyChecked(true) // prevent re-navigation
      navigate('/login')
    }else{
      setLoggedInAlreadyChecked(true) // prevent re-navigation
      navigate('/dashboard')

    }
    }

    verifyAuth()
  }, [userData, navigate, loggedInAlreadyChecked])

 
    // Request all posts from the server
    const updatePosts = useCallback(async () => {
      try {
        const result = await getHydratedPosts(userData.token);
        console.log(`updatePosts() result: ${JSON.stringify(result.data, null, 2)}`);
        const posts = result.posts;
        console.log(`posts: ${JSON.stringify(posts, null, 2)}`);
        setPosts(posts);
      } catch (e) {
        console.warn('Error in post/updatePosts()', e.message)
        throw e
      }
    }, [userData]);


  return {
    lsState,
    setLSState,
    removeLocalStorageItem,
    updateLocalStorage,
    userData,
    setUserData,
    logout,
    updatePosts,
    posts,
  }
}

export default useAppState
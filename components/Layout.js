import { useState } from 'react'
import { groupContext } from '../providers/groupContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const Layout = ({ children }) => {
  const [loader, setLoader] = useState(true)
  const [groupDetail, setGroupDetail] = useState([])
  const [list, setList] = useState([])


  const callGroupApi = async () => {
    // if (AsyncStorage.removeItem('Token')) {
    //   props.navigation.navigate("Login")
    // }
    const userId = await AsyncStorage.getItem('userId');
    console.log("userId", userId)
    try {
      const token = await AsyncStorage.getItem('Token');
      console.log(token)
      const res = await axios.get(`https://split-application.onrender.com/api/v1/groups`, { headers: { Authorization: `Bearer ${token}` } })
      console.log(res.data.data)
      setGroupDetail(res.data.data)
      setLoader(false)
    }
    catch (error) {
      console.log(error.message)
    }
  }

  const getOneGroupDetail = async () => {
    const groupId = await AsyncStorage.getItem('GroupId');
    const token = await AsyncStorage.getItem('Token');
    console.log("groupPage===", groupId)
    try {
      const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/findone/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } })
      console.log(res.data)
      setList(res.data.data?.groupInfo)
      setLoader(false)
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <groupContext.Provider value={{ loader, groupDetail, callGroupApi, getOneGroupDetail, list }}>{children}</groupContext.Provider>
  )
}

export default Layout
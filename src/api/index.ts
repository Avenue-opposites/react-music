import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.response.use((response) => {
  if(response.data.data) {
    response.data = response.data.data
  }
  return response
})

export default api
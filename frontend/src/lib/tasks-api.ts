import axios from "axios";

const API_URL ='http://localhost:3001/tasks'


//get all tasks
export  const getTasks = async ()=>{
    try{
        const response = await axios.get(`${API_URL}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to get tasks')
        }
    }
}
//get task by id
export const getTaskById = async (id:string)=>{
    try{
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to get task')
        }
    }
}    
//create task
export const createTask = async (taskData: {
    title: string
    description: string
    status: string
    priority: string
    dueDate: string
  }) => {
    try {
      console.log('API URL:', API_URL)
      console.log('Creating task with data:', taskData)
      
      const response = await axios.post(API_URL, taskData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Task created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Full error object:', error)
      
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response headers:', error.response?.headers)
        console.error('Response data:', error.response?.data)
        console.error('Request config:', {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        })
        
        // Try to get more specific error message
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.response?.data || 
                            `Server error: ${error.response?.status}`
        
        throw new Error(`Failed to create task: ${errorMessage}`)
      }
      
      throw new Error('Failed to create task: Network error')
    }
  }
//update task
export const updataTask= async (id:string,taskData:{
    title:string,
    description:string,
    status:string,
    dueDate:string,
})=>{
    try{
        const response = await axios.put(`${API_URL}/${id}`,taskData)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to update task')
        }
    }
}
//delete task
export const deleteTask = async (id:string)=>{
    try{
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to delete task')
        }
    }
}

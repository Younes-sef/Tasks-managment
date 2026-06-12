import api from './axios';
import axios from 'axios';

//get all tasks
export  const getTasks = async ()=>{
    try{
        const response = await api.get('/tasks')
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
        const response = await api.get(`/tasks/${id}`)
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
    tags?: string[]
  }) => {
    try {
      console.log('Creating task with data:', taskData)
      
      const response = await api.post('/tasks', taskData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Task created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Full error object:', error)
      
      if (axios.isAxiosError(error)) {
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
export const updateTask = async (id:string, taskData: Partial<{
    title:string,
    description:string,
    status:string,
    dueDate:string,
    priority:string,
}>) => {
    try{
        const response = await api.put(`/tasks/${id}`,taskData)
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
        const response = await api.delete(`/tasks/${id}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to delete task')
        }
    }
}

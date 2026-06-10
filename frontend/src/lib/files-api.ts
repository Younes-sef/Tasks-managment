import axios from "axios";

const API_URL ='http://localhost:3001/files'

//get all files
export const getAllFiles = async ()=>{
    try{
        const response = await axios.get(`${API_URL}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to fetch files')
        }
    }
}

//create file
export const createFile = async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          // Don't manually set multipart headers — axios handles it
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message || 'Failed to create file');
      }
    }
  };
//delete file
export const deleteFile = async (id:string)=>{
    try{
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to delete file')
        }
    }
}
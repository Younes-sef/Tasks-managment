import api from './axios';
import axios from 'axios';

//get all files
export const getAllFiles = async ()=>{
    try{
        const response = await api.get('/files')
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
      const response = await api.post('/files/upload', formData, {
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
        const response = await api.delete(`/files/${id}`)
        return response.data
    }catch(error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data.message || 'Failed to delete file')
        }
    }
}

//download file
export const downloadFile = async ({ id, originalName }: { id: string, originalName: string }) => {
    try {
        const response = await api.get(`/files/${id}/download`, {
            responseType: 'blob',
        });
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', originalName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Failed to download file');
        }
        throw error;
    }
}
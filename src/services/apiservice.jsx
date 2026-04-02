import axios from "axios";

const API_URL = "http://127.0.0.1:9000/api"

export const postApiCall = async ({ endpoint, data }) => {
    try {
        const response = await axios.post(API_URL + endpoint, data.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const uploadAudioCall = async ({ endpoint, formData }) => {
    try {
        const response = await axios.post(API_URL + endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const getApiCall = async ({ endpoint }) => {
    try {
        const response = await axios.get(process.env.API_URL + endpoint);
        return response.json();
    } catch (error) {
        console.error(error);
        return error;
    }
}


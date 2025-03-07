import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api"

export const postApiCall = async ({ endpoint, data }) => {
    try {
        console.log(data.data);
        const response = await axios.post(API_URL + endpoint, data.data);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
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


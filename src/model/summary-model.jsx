import { postApiCall } from "../services/apiservice";


const summarizeModel = async (data) => {
    try {
        const response = await postApiCall({ endpoint: '/summarize', data: data });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export default summarizeModel;
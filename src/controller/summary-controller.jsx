import summarizeModel from "../model/summary-model";

const summaryController = async (data) => {
    try {
        console.log(data)
        const response = await summarizeModel({ data: data });
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default summaryController;
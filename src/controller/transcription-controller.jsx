import transcribeAudio from "../model/transcription-model";

const transcriptionController = async (file) => {
    try {
        const formData = new FormData();
        formData.append("audio", file);
        const response = await transcribeAudio(formData);
        return response;
    } catch (error) {
        console.error("Transcription controller error:", error);
        throw error;
    }
}

export default transcriptionController;

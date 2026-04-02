import { uploadAudioCall } from "../services/apiservice";

const transcribeAudio = async (formData) => {
    try {
        const response = await uploadAudioCall({ endpoint: "/transcribe", formData });
        return response;
    } catch (error) {
        console.error("Transcribe API error:", error);
        throw error;
    }
}

export default transcribeAudio;

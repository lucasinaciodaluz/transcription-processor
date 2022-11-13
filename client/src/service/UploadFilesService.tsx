import axios, { AxiosResponse } from "axios";

export const PROCESS_STATUS = {
    COMPLETED: "completed",
    PROCESSING: "processing",
    QUEUED: "queued",
    ERROR: "error"
}

class UploadFilesService {
    upload(file: string | Blob, language: string, onUploadProgress: (event: any) => void) {
        let formData = new FormData();
        formData.append("filepath", file);
        return axios.post(`/api/upload-audio?language=${language}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    }

    async getFiles(id: any) {
        return this.getProcessingAssembly(id);
    }

    async getProcessingAssembly(id: any) {
        try {
            const delay = 1000;
            const processing = await this.getProcessingStatus(id);
            let status: any = processing.status;
            let processingPercentage = 0;
            let transcribing = '';
            
            while (status !== PROCESS_STATUS.COMPLETED && status !== PROCESS_STATUS.ERROR) {
                console.log(`Status [${status}]: AssemblyAI is still transcribing your audio.`);
                await this.wait(delay);
                const processingStatus = await this.getProcessingStatus(id);
                processingPercentage = this.getPercentProcessingStatus(processingStatus);
                status = processingStatus.data.status;
                if (status === PROCESS_STATUS.ERROR) {
                    throw Error(processingStatus.data.error);
                }
                transcribing = processingStatus.data.text;
            }
            console.log(`Status [${status}]: AssemblyAI finished to transcribing your audio.`);
            return {
                status: PROCESS_STATUS.COMPLETED,
                percentage: processingPercentage,
                text: transcribing
            };
        } catch (error) {
            throw error;
        }
    }
    
    async getProcessingStatus(id: any) {
        const authorization: string | undefined = process.env.ASSEMBLYAI_API_KEY;
        const url = "https://api.assemblyai.com/v2";
        const endpoint = `${url}/transcript/${id}`;
        const params = {
            method: 'GET',
            url: endpoint,
            headers: {
                'Authorization': String(authorization)
            }
        };
        const processingStatus = await axios(params);
        return processingStatus;
    }

    getPercentProcessingStatus(processingStatus: AxiosResponse<any, any>) {
        const processingStatusData = processingStatus.data;
        let percentProcessed = 0;
        if (processingStatusData.words !== null) {
            const audioTimeInMilliSeconds = processingStatusData.audio_duration;
            const processingWordPosition = processingStatusData.words.length;
            const lastWordProcessed = processingStatusData.words[processingWordPosition - 1];
            percentProcessed = Math.round(Math.floor(lastWordProcessed.end / 1000) / audioTimeInMilliSeconds) * 100;
            return percentProcessed;
        }
        return percentProcessed;
    }
    
    wait = (time: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    };

}


export default new UploadFilesService();

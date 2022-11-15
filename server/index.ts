const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require("axios");
const fs = require('fs');
const formidable = require('formidable');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())

const authorization = process.env.ASSEMBLYAI_API_KEY;
const url = "https://api.assemblyai.com/v2";

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "Working"});
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.post('/api/upload-audio/', (req, res) => {
    try {
        const languageCode = req.query.language;
        console.log(`Language code: ${languageCode}`);
        const form = new formidable.IncomingForm();
        form.parse(req, async function (error, fields, file) {
            const filePath = file.filepath.filepath;
            const fileData = uploadFile(filePath);
            const uploadAudioResponse = await sendAudio(fileData);
            const processing = await processTranscription(uploadAudioResponse.data["upload_url"], languageCode);
            const { id } = processing;
            res.json({ id: id });
        });
    } catch (error) {
        res.json({ 
            message: {
                title: "Failed to process request",
                cause: error
            }
        })
    }
});

function uploadFile(filePath) {
    try {
        return fs.readFileSync(filePath);
    } catch (error) {
        throw error;
    }
}

async function sendAudio(data) {
    try {
        const endpoint = "/upload"; 
        const assembly = axios.create({
            baseURL: url,
            headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
                "Transfer-Encoding": "chunked",
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        return await assembly.post(endpoint, data);
    } catch (error) {
        throw error;
    }
}

function createAssembly() {
    try {
        return axios.create({
            baseURL: url,
            headers: {
              "Authorization": authorization,
              "Content-Type": "application/json"
            }
        });
    } catch(error) {
        throw error;
    }
}

async function processTranscription(uploadUrl, languageCode) {
    try {
        const endpoint = "/transcript";
        const assembly = createAssembly();
        const processing = await assembly.post(endpoint, 
            {
                audio_url: uploadUrl,
                language_code: languageCode
            }
        );
        return processing.data;
    } catch (error) {
        throw error;
    }
}

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

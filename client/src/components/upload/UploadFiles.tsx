import React from "react";
import UploadService, { PROCESS_STATUS } from "../../service/UploadFilesService";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, FileInput, Progress } from "flowbite-react";

const MySwal = withReactContent(Swal);

const LANGUAGES = {
    GLOBAL_ENGLISH: "en",
    AUSTRALIAN: "en_au",
    BRITISH: "en_uk",
    US: "en_us",
    SPANISH: "es",
    FRENCH: "fr",
    GERMAN: "de",
    ITALIAN: "it",
    PORTUGUESE: "pt",
    DUTCH: "nl",
    HINDI: "hi",
    JAPANESE: "ja"
}

const language_options = [
    {	
        name: "Global English", 
        value: LANGUAGES.GLOBAL_ENGLISH
    },
    {	
        name: "Australian", 
        value: LANGUAGES.AUSTRALIAN
    },
    {	
        name: "British", 
        value: LANGUAGES.BRITISH
    },
    {	
        name: "US", 
        value: LANGUAGES.US
    },
    {	
        name: "Spanish", 
        value: LANGUAGES.SPANISH
    },
    {	
        name: "French", 
        value: LANGUAGES.FRENCH
    },
    {	
        name: "German", 
        value: LANGUAGES.GERMAN
    },
    {	
        name: "Italian", 
        value: LANGUAGES.ITALIAN
    },
    {	
        name: "Portuguese", 
        value: LANGUAGES.PORTUGUESE
    },
    {	
        name: "Dutch", 
        value: LANGUAGES.DUTCH
    },
    {	
        name: "Hindi", 
        value: LANGUAGES.HINDI
    },
    {	
        name: "Japanese", 
        value: LANGUAGES.JAPANESE
    }
]

export default class UploadFiles extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);

        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            id: "",
            language: LANGUAGES.PORTUGUESE
        };
    }

    handleChange(value: string): void {
        if (value === null || value === undefined) {
            throw new Error("The language was not selected.");
        }
        this.setState({
            language: value
        });
    }

    selectFile(event: { target: { files: any; }; }) {
        this.setState({
            selectedFiles: event.target.files,
        });
    }

    upload() {
        const language = this.state.language;
        let currentFile = this.state.selectedFiles[0];
        this.setState({
            progress: 0,
            currentFile: currentFile
        });
        UploadService.upload(currentFile, language, (event: any) => { })
            .then((response) => {
                const id = response.data.id;
                const intervalId = setInterval(() => {
                    UploadService.getFiles(id)
                        .then((response) => {
                            this.setState({ progress: response.percentage });
                            if (response.status === PROCESS_STATUS.COMPLETED) {
                                this.setState({ message: response.text });
                                clearInterval(intervalId);
                            }
                        })
                        .catch((error) => {
                            MySwal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: `Caused by: ${error}`
                            });
                            clearInterval(intervalId);
                        });
                }, 5000);
            })
            .catch(() => {
                this.setState({
                    progress: 0,
                    message: "",
                    currentFile: undefined,
                });
            });

        this.setState({
            selectedFiles: undefined,
        });
    }

    render() {
        const {
            selectedFiles,
            currentFile,
            progress,
            message
        } = this.state;

        return (
            <div>
                <div className="px-4 py-6 sm:px-0">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">Your transcription:</p>
                    <blockquote className="p-4 my-4 bg-gray-50 border-l-4 border-gray-300 dark:border-gray-500 dark:bg-gray-800">
                        <p className="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white">
                            {message}
                        </p>
                    </blockquote>
                    <div className="flex items-stretch">
                        {currentFile && (
                            <div className="progress" hidden={currentFile}>
                                <div className="text-base font-medium text-blue-700">
                                    {progress}%
                                </div>
                                <Progress
                                    progress={Number(progress)}
                                    color="blue"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-stretch">
                        <div className="flex-1 text-center pr-2">
                            <FileInput id="file_input" onChange={this.selectFile} />
                        </div>
                        <div className="flex-3 text-center pr-2">
                            <select
                                id="large"
                                className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
                                onChange={e => this.handleChange(e.target.value)}>
                                {language_options.map(language => (
                                    <option key={language.value} value={language.value}>{language.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 text-center pr-2">
                            <Button type="submit" disabled={!selectedFiles} onClick={this.upload}>
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

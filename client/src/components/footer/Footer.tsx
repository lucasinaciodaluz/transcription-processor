import { Footer } from "flowbite-react";

function FooterPage() {
    return (
        <Footer container={true}>
            <Footer.Copyright
                by="Transcription Processor"
                year={new Date().getFullYear()}
            />
        </Footer>
    );
}

export default FooterPage;
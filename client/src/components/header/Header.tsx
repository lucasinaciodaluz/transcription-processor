import { Navbar } from "flowbite-react/lib/esm/components/Navbar";

function HeaderPage() {
    return (
        <Navbar
            fluid={true}
            rounded={true}
        >
            <Navbar.Brand>
                <img
                    src="https://avatars.githubusercontent.com/u/24515738?s=200&v=4"
                    className="h-12"
                    alt="AssemblyAI"
                />
                <div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Transcription Processor              
                    </span>
                    <span className="pl-2">is using AssemblyAI</span>
                </div>
                
            </Navbar.Brand>

        </Navbar>
    );
}

export default HeaderPage;

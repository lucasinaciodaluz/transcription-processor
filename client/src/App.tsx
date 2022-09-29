import FooterPage from "./components/footer/Footer";
import HeaderPage from "./components/header/Header";
import UploadFiles from "./components/upload/UploadFiles";

function App() {
    return (
        <div className="min-h-screen">
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <HeaderPage />
                    <UploadFiles />
                </div>
            </main>
            <div className="sticky top-[100vh] mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <FooterPage />
            </div>
        </div>
    );
}

export default App;

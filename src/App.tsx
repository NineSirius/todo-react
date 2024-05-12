import { PromptProvider } from 'containers/PromptProvider'
import { Navbar } from 'components/Navbar'
import { HomePage } from 'containers/HomePage'
import { ProjectPage } from 'containers/ProjectPage'
import { Routes, Route } from 'react-router-dom'
import { ModalProvider } from '@containers/ModalProvider'

function App() {
    return (
        <>
            <ModalProvider>
                <PromptProvider>
                    <Navbar />
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/projects/:id" element={<ProjectPage />} />
                        </Routes>
                    </div>
                </PromptProvider>
            </ModalProvider>
        </>
    )
}

export default App

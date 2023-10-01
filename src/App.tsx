import { Navbar } from 'components/Navbar'
import { HomePage } from 'containers/HomePage'
import { ProjectPage } from 'containers/ProjectPage'
import { Routes, Route } from 'react-router-dom'

function App() {
    return (
        <>
            <Navbar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects/:id" element={<ProjectPage />} />
                </Routes>
            </div>
        </>
    )
}

export default App

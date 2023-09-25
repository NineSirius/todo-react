import { HomePage } from 'containers/HomePage'
import { ProjectPage } from 'containers/ProjectPage'
import { Routes, Route } from 'react-router-dom'

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
        </Routes>
    )
}

export default App

import { useState, useEffect } from 'react'
import { ProjectT } from '../../types/ProjectT'

export const HomePage = () => {
    const [projects, setProjects] = useState<ProjectT[] | null>([
        { title: 'Первый проект', createdAt: new Date(), tasks: [], id: 'first' },
    ])

    useEffect(() => {
        const projects = localStorage.getItem('projects')
        setProjects(projects && JSON.parse(projects))
    }, [])

    return (
        <div className="container">
            <h1>Ваши проекты</h1>

            {projects ? projects.map((item) => <div>{item.title}</div>) : 'У вас нету проектов'}
        </div>
    )
}

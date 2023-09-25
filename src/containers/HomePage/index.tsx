import { useState, useEffect } from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './HomePage.module.sass'
import { ProjectCard } from '../../components/ProjectCard'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
    const [projects, setProjects] = useState<ProjectT[] | null>(null)

    useEffect(() => {
        const projects = localStorage.getItem('projects')
        setProjects(projects && JSON.parse(projects))
        // addProject('Мой первый проект', '#9d6c27')
    }, [])

    useEffect(() => {
        if (projects) {
            localStorage.setItem('projects', JSON.stringify(projects))
        }
    }, [projects])

    const navigate = useNavigate()

    const addProject = (title: string, color: string) => {
        const project: ProjectT = {
            title,
            createdAt: new Date(),
            tasks: [],
            id: title.toLowerCase(),
            bg: {
                url: null,
                color: color,
            },
        }
        setProjects((prev) => {
            if (prev) {
                return [...prev, project]
            } else {
                return [project]
            }
        })
    }

    return (
        <div className={`container ${styles.home}`}>
            <h1>Ваши проекты</h1>

            <div className={styles.projects}>
                {projects
                    ? projects.map((item) => (
                          <ProjectCard
                              key={item.id}
                              title={item.title}
                              id={item.id}
                              tasks={item.tasks}
                              createdAt={item.createdAt}
                              onClick={() => navigate(`/projects/${item.id}`)}
                              bg={item.bg}
                          />
                      ))
                    : 'У вас нету проектов'}
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './HomePage.module.sass'
import { ProjectCard } from '../../components/ProjectCard'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'components/UI/Modal'

export const HomePage = () => {
    const [projects, setProjects] = useState<ProjectT[] | null>(null)
    const [newProjectModal, setNewProjectModal] = useState<boolean>(false)
    const [editProjectModal, setEditProjectModal] = useState<boolean>(false)
    const [projectId, setProjectId] = useState<string>('')
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false)
    const [deleteProjectIndex, setDeleteProjectIndex] = useState<number>(0)
    const [projectName, setProjectName] = useState<string>('')
    const [projectColor, setProjectColor] = useState<string>('')

    useEffect(() => {
        const projects = localStorage.getItem('projects')
        setProjects(projects && JSON.parse(projects))
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
            id: `${title.toLowerCase()}-${Math.random()}`,
            bg: {
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
        setProjectColor('#000')
        setProjectName('')
        setNewProjectModal(false)
    }

    const editProject = (projectId: string, data: { title: string; color: string }) => {
        if (projects) {
            projects.forEach((item, index) => {
                console.log(item, index)

                if (item.id === projectId) {
                    const projectsCopy = [...projects]
                    projectsCopy.splice(index, 1, {
                        ...projectsCopy[index],
                        title: data.title,
                        bg: { color: data.color },
                    })
                    setProjects(projectsCopy)
                }
            })
        }
    }

    const deleteProject = (index: number) => {
        setProjects((prev) => {
            if (prev) {
                const copyProjects = [...prev]
                copyProjects.splice(index, 1)
                setDeleteProjectIndex(0)
                setDeleteConfirmModal(false)
                return copyProjects
            } else {
                return null
            }
        })
    }

    const projectNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setProjectName(e.target.value)

    const projectColorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setProjectColor(e.target.value)

    const newProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        addProject(projectName, projectColor)
    }

    const editProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        editProject(projectId, { title: projectName, color: projectColor })
        setEditProjectModal(false)
        setProjectName('')
        setProjectColor('')
    }

    return (
        <div className={`container ${styles.home}`}>
            <h1>Ваши проекты</h1>

            <div className={styles.projects}>
                {projects &&
                    projects.map((item, index) => (
                        <ProjectCard
                            key={item.id}
                            title={item.title}
                            id={item.id}
                            tasks={item.tasks}
                            createdAt={item.createdAt}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                                navigate(`/projects/${item.id}`)
                            }}
                            bg={item.bg}
                            // @ts-ignore
                            deleteProject={(e) => {
                                e.stopPropagation()
                                setDeleteProjectIndex(index)
                                setDeleteConfirmModal(true)
                            }}
                            //@ts-ignore
                            editProject={(e) => {
                                e.stopPropagation()
                                setProjectId(item.id)
                                setProjectName(item.title)
                                setProjectColor(item.bg.color)
                                setEditProjectModal(true)
                            }}
                        />
                    ))}
                <div className={styles.card} onClick={() => setNewProjectModal(true)}>
                    Создать проект
                </div>
            </div>

            <Modal
                show={newProjectModal}
                onClose={() => {
                    setNewProjectModal(false)
                    setProjectColor('#000')
                    setProjectName('')
                }}
            >
                <h4>Создание проекта</h4>
                <form onSubmit={newProjectSubmit} className={styles.form}>
                    <label>
                        <span>Название проекта*</span>
                        <input
                            type="text"
                            value={projectName}
                            required
                            onChange={projectNameChange}
                        />
                    </label>
                    <label>
                        <span>Выберите цвет*</span>
                        <input
                            type="color"
                            value={projectColor}
                            required
                            onChange={projectColorChange}
                        />
                    </label>
                    <button type="submit">Создать</button>
                </form>
            </Modal>

            <Modal
                show={editProjectModal}
                onClose={() => {
                    setProjectColor('#000')
                    setProjectName('')
                    setEditProjectModal(false)
                }}
            >
                <h4>Изменение проекта</h4>
                <form onSubmit={editProjectSubmit} className={styles.form}>
                    <label>
                        <span>Название проекта*</span>
                        <input
                            type="text"
                            value={projectName}
                            required
                            onChange={projectNameChange}
                        />
                    </label>
                    <label>
                        <span>Выберите цвет*</span>
                        <input
                            type="color"
                            value={projectColor}
                            required
                            onChange={projectColorChange}
                        />
                    </label>
                    <button type="submit">Изменить</button>
                </form>
            </Modal>

            <Modal show={deleteConfirmModal} onClose={() => setDeleteConfirmModal(false)}>
                <div className={styles.delete_wrap}>
                    <h4>Удаление проекта</h4>
                    <p>Вы действительно хотите удалить этот проект</p>

                    {projects && projects[deleteProjectIndex] && (
                        <ProjectCard
                            title={projects[deleteProjectIndex].title}
                            id={projects[deleteProjectIndex].id}
                            tasks={projects[deleteProjectIndex].tasks}
                            createdAt={projects[deleteProjectIndex].createdAt}
                            bg={projects[deleteProjectIndex].bg}
                        />
                    )}

                    <div className={styles.buttons}>
                        <button onClick={() => setDeleteConfirmModal(false)}>Отменить</button>
                        <button onClick={() => deleteProject(deleteProjectIndex)}>Да</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

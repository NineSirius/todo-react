import { useState, useEffect } from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './HomePage.module.sass'
import { ProjectCard } from '../../components/ProjectCard'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'components/UI/Modal'
import { Helmet } from 'react-helmet'
import { usePrompt } from 'containers/PromptProvider'
import { MdCheck } from 'react-icons/md'

type BackgroundT = {
    color: string
    active: boolean
}

export const HomePage = () => {
    const [projects, setProjects] = useState<ProjectT[] | null>(null)
    const [newProjectModal, setNewProjectModal] = useState<boolean>(false)
    const [editProjectModal, setEditProjectModal] = useState<boolean>(false)
    const [projectId, setProjectId] = useState<string>('')
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<boolean>(false)
    const [deleteProjectIndex, setDeleteProjectIndex] = useState<number>(0)
    const [projectName, setProjectName] = useState<string>('')
    const [backgrounds, setBackgrounds] = useState<BackgroundT[]>([
        { color: '#777', active: false },
        { color: '#a41c1c', active: false },
        { color: '#1938e6', active: false },
        { color: '#bd1d8b', active: false },
        { color: '#41ff37', active: false },
    ])
    const [activeBackground, setActiveBackground] = useState<number>(0)

    const { openPrompt } = usePrompt()

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
            columns: [
                { title: 'Queue', id: '90648336-634e-11ee-8c99-0242ac120002', tasks: [] },
                {
                    title: 'Development',
                    id: 'ae8c6248-634e-11ee-8c99-0242ac120002',
                    tasks: [],
                },
                { title: 'Done', id: 'b7ac8b0a-634e-11ee-8c99-0242ac120002', tasks: [] },
            ],
            bg: {
                color: backgrounds[activeBackground].color,
            },
        }
        setProjects((prev) => {
            if (prev) {
                return [...prev, project]
            } else {
                return [project]
            }
        })
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

    const newProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        addProject(projectName, backgrounds[activeBackground].color)
    }

    const editProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        editProject(projectId, { title: projectName, color: backgrounds[activeBackground].color })
        setEditProjectModal(false)
        setProjectName('')
    }

    return (
        <>
            <Helmet>
                <title>ToDo React - Создавайте и управляйте задачи</title>
            </Helmet>
            <div className={`${styles.home}`}>
                <header className={styles.home_header}>
                    <h1>ToDo App</h1>
                    <p>Как Trello, только хуже</p>
                </header>
                <h2>Ваши проекты</h2>

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
                                    openPrompt(
                                        'Удаление проекта',
                                        'Вы действительно хотите удалить проект? Удаляя проект вы также потеряете все данные с ним связанные в том числе и задачи. После подтверждения отмена невозможна',
                                        () => deleteProject(index),
                                    )
                                }}
                                //@ts-ignore
                                editProject={(e) => {
                                    e.stopPropagation()
                                    setProjectId(item.id)
                                    setProjectName(item.title)
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
                    title={<h4>Создание проекта</h4>}
                    onClose={() => {
                        setNewProjectModal(false)
                        setProjectName('')
                    }}
                >
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
                            <span>Выберите фон карточки*</span>
                            <div className={styles.colors}>
                                {backgrounds.map((bg, index) => (
                                    <div
                                        style={{ backgroundColor: bg.color }}
                                        onClick={() => setActiveBackground(index)}
                                    >
                                        {activeBackground === index && <MdCheck />}
                                    </div>
                                ))}
                            </div>
                        </label>
                        <button type="submit">Создать</button>
                    </form>
                </Modal>

                <Modal
                    show={editProjectModal}
                    title={<h4>Изменение проекта</h4>}
                    onClose={() => {
                        setProjectName('')
                        setEditProjectModal(false)
                    }}
                >
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
                            <span>Выберите фон карточки*</span>
                            <div className={styles.colors}>
                                {backgrounds.map((bg, index) => (
                                    <div
                                        style={{ backgroundColor: bg.color }}
                                        onClick={() => setActiveBackground(index)}
                                    >
                                        {activeBackground === index && <MdCheck />}
                                    </div>
                                ))}
                            </div>
                        </label>
                        <button type="submit">Изменить</button>
                    </form>
                </Modal>
            </div>
        </>
    )
}

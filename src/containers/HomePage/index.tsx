import { useState, useEffect } from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './HomePage.module.sass'
import { ProjectCard } from '../../components/ProjectCard'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'components/UI/Modal'
import { Helmet } from 'react-helmet'
import { usePrompt } from 'containers/PromptProvider'
import { MdCheck } from 'react-icons/md'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Button } from 'components/UI/Button'
import { v4 as uuidv4 } from 'uuid'

type BackgroundT = {
    color: string
    active: boolean
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export const HomePage = () => {
    const [projects, setProjects] = useState<ProjectT[] | null>(null)
    const [newProjectModal, setNewProjectModal] = useState<boolean>(false)
    const [editProjectModal, setEditProjectModal] = useState<boolean>(false)
    const [projectId, setProjectId] = useState<string>('')
    const [projectName, setProjectName] = useState<string>('')

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

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const sourceIndex = result.source.index
        const destinationIndex = result.destination.index

        if (projects) {
            const sortedProjects = reorder(projects, sourceIndex, destinationIndex)
            console.log(sortedProjects)
            setProjects(sortedProjects)
        }
    }

    const addProject = (title: string) => {
        const project: ProjectT = {
            title,
            createdAt: new Date(),
            tasks: [],
            id: `${title.toLowerCase()}-${uuidv4()}`,
            columns: [
                { title: 'Queue', id: '90648336-634e-11ee-8c99-0242ac120002', tasks: [] },
                {
                    title: 'Development',
                    id: 'ae8c6248-634e-11ee-8c99-0242ac120002',
                    tasks: [],
                },
                { title: 'Done', id: 'b7ac8b0a-634e-11ee-8c99-0242ac120002', tasks: [] },
            ],
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

    const editProject = (projectId: string, title: string) => {
        if (projects) {
            projects.forEach((item, index) => {
                console.log(item, index)

                if (item.id === projectId) {
                    const projectsCopy = [...projects]
                    projectsCopy.splice(index, 1, {
                        ...projectsCopy[index],
                        title,
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
        addProject(projectName)
    }

    const editProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        editProject(projectId, projectName)
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

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="projects" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div
                                className={styles.projects}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {projects &&
                                    projects.map((item, index) => (
                                        <ProjectCard
                                            key={item.id}
                                            title={item.title}
                                            index={index}
                                            id={item.id}
                                            tasks={item.tasks}
                                            createdAt={item.createdAt}
                                            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                                                navigate(`/projects/${item.id}`)
                                            }}
                                            // @ts-ignore
                                            deleteProject={(e) => {
                                                e.stopPropagation()
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
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <Button onClick={() => setNewProjectModal(true)}>Создать проект</Button>

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

                        <Button>Создать</Button>
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

                        <Button>Изменить</Button>
                    </form>
                </Modal>
            </div>
        </>
    )
}

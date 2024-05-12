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
import { Alert } from 'components/UI/Alert'
import { useModal } from '@containers/ModalProvider'
import { ProjectControlsModal } from '@components/Modals/ProjectControlsModal'

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
    const [startMessage, setStartMessage] = useState<any>(localStorage.getItem("start_message") || true)

    const { openPrompt } = usePrompt()
    const { openModal, closeModal } = useModal()

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

    const newProjectSubmit = (projectName: string) => {
        addProject(projectName)
        closeModal()

    }

    const editProjectSubmit = (projectName: string) => {
        editProject(projectId, projectName)
        closeModal()
    }

    const onAlertClose = () => {
        setStartMessage(false)
        localStorage.setItem("start_message", "false")
    }

    const openNewProjectModal = () => {
        openModal(<ProjectControlsModal type='add' onSubmit={newProjectSubmit} projectId={projectId} />, "Создание проекта")
    }

    const openEditProjectModal = (title: string) => {
        openModal(<ProjectControlsModal type='edit' onSubmit={editProjectSubmit} projectId={projectId} title={title} />, "Редактирование проекта")
    }

    return (
        <>
            <Helmet>
                <title>ToDo React - Создавайте и управляйте задачи</title>
            </Helmet>
            <div className={`${styles.home}`}>
                {!startMessage || startMessage !== "false" && <Alert variant='error' onClose={onAlertClose}>
                    Все проекты хранятся локально, то есть в вашем браузере. И если вы удалите данные вашего браузера или сайта, то все ваши проекты пропадут.
                </Alert>}

                <h2 style={{ marginTop: 10 }}>Ваши проекты</h2>

                <div className={styles.projects}>
                    <button className={styles.createProjectCard} onClick={openNewProjectModal}>
                        <h3>Создать проект</h3>
                    </button>
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
                                    openEditProjectModal(item.title)
                                }}
                            />
                        ))}
                </div>
            </div>
        </>
    )
}

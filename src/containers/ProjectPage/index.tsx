import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { ProjectT } from 'types/ProjectT'
import { TaskT } from 'types/TaskT'
import styles from './ProjectPage.module.sass'
import { TaskColumn } from './TaskColumn'
import { Modal } from 'components/UI/Modal'
import { format, parseISO } from 'date-fns'

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

const sortTasksByPosition = (tasks: TaskT[]) => {
    return tasks.slice().sort((a, b) => a.position - b.position)
}

export const ProjectPage = () => {
    const [projectInfo, setProjectInfo] = useState<ProjectT | null>(null)
    const [queue, setQueue] = useState<TaskT[]>([])
    const [done, setDone] = useState<TaskT[]>([])
    const [development, setDevelopment] = useState<TaskT[]>([])
    const [taskInfoModal, setTaskInfoModal] = useState<boolean>(false)
    const [taskInfo, setTaskInfo] = useState<TaskT | null>(null)

    const { id } = useParams()

    const openTaskInfoModal = (id: string) => {
        if (projectInfo) {
            const task = projectInfo.tasks.find((task) => task.id === id)
            if (task) {
                setTaskInfo(task)
                setTaskInfoModal(true)
            }
        }
    }

    useEffect(() => {
        const projects = localStorage.getItem('projects')
        if (projects) {
            const parsedProjects = JSON.parse(projects)
            const project = parsedProjects.find((item: ProjectT) => item.id === id)
            if (project) {
                setProjectInfo(project)
                renderTasksFromProject(project)
            }
        }
    }, [id])

    const renderTasksFromProject = (project: ProjectT) => {
        const queueTasks = project.tasks.filter((task: TaskT) => task.column === 'queue')
        const doneTasks = project.tasks.filter((task: TaskT) => task.column === 'done')
        const developmentTasks = project.tasks.filter(
            (task: TaskT) => task.column === 'development',
        )

        setQueue(sortTasksByPosition(queueTasks))
        setDone(sortTasksByPosition(doneTasks))
        setDevelopment(sortTasksByPosition(developmentTasks))
    }

    useEffect(() => {
        if (projectInfo) {
            const projects = localStorage.getItem('projects')
            if (projects) {
                const parsedProjects = JSON.parse(projects)
                const updatedProjects = parsedProjects.map((item: ProjectT) => {
                    if (item.id === projectInfo.id) {
                        return projectInfo
                    }
                    return item
                })

                localStorage.setItem('projects', JSON.stringify(updatedProjects))
            }

            renderTasksFromProject(projectInfo)
        }
    }, [projectInfo])

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const { source, destination } = result
        const movedTask = projectInfo?.tasks.find((task) => task.id === result.draggableId)

        if (source.droppableId === destination.droppableId && movedTask) {
            const updatedTasks = reorder(
                source.droppableId === 'queue'
                    ? queue
                    : source.droppableId === 'done'
                    ? done
                    : development,
                source.index,
                destination.index,
            )

            updatedTasks.forEach((task, index) => {
                task.position = index
            })

            switch (source.droppableId) {
                case 'queue':
                    setQueue(updatedTasks)
                    break
                case 'done':
                    setDone(updatedTasks)
                    break
                case 'development':
                    setDevelopment(updatedTasks)
                    break
                default:
                    break
            }
        } else if (movedTask) {
            movedTask.column = destination.droppableId
            movedTask.position = destination.index

            const sourceColumnTasks =
                source.droppableId === 'queue'
                    ? queue
                    : source.droppableId === 'done'
                    ? done
                    : development

            const destinationColumnTasks =
                destination.droppableId === 'queue'
                    ? queue
                    : destination.droppableId === 'done'
                    ? done
                    : development

            const updatedSourceTasks = [...sourceColumnTasks]
            updatedSourceTasks.splice(source.index, 1)

            const updatedDestinationTasks = [...destinationColumnTasks]
            updatedDestinationTasks.splice(destination.index, 0, movedTask)

            switch (source.droppableId) {
                case 'queue':
                    setQueue(updatedSourceTasks)
                    break
                case 'done':
                    setDone(updatedSourceTasks)
                    break
                case 'development':
                    setDevelopment(updatedSourceTasks)
                    break
                default:
                    break
            }

            switch (destination.droppableId) {
                case 'queue':
                    setQueue(updatedDestinationTasks)
                    break
                case 'done':
                    setDone(updatedDestinationTasks)
                    break
                case 'development':
                    setDevelopment(updatedDestinationTasks)
                    break
                default:
                    break
            }
        }

        if (projectInfo) {
            const projects = localStorage.getItem('projects')
            if (projects) {
                const parsedProjects = JSON.parse(projects)
                const updatedProjects = parsedProjects.map((item: ProjectT) => {
                    if (item.id === projectInfo.id) {
                        return projectInfo
                    }
                    return item
                })

                localStorage.setItem('projects', JSON.stringify(updatedProjects))
            }

            renderTasksFromProject(projectInfo)
        }
    }

    const createTask = (column: string, title: string, description?: string) => {
        const newTask: TaskT = {
            id: Date.now().toString(),
            title: title,
            description: description ? description : '',
            column,
            position: 0,
            createdAt: new Date().toJSON(),
        }

        newTask.position =
            column === 'queue' ? queue.length : column === 'done' ? done.length : development.length

        if (projectInfo) {
            const projectInfoCopy = { ...projectInfo }
            projectInfoCopy.tasks.push(newTask)
            setProjectInfo(projectInfoCopy)
        }

        switch (column) {
            case 'queue':
                setQueue([...queue, newTask])
                break
            case 'done':
                setDone([...done, newTask])
                break
            case 'development':
                setDevelopment([...development, newTask])
                break
            default:
                break
        }
    }

    return (
        <>
            <div className="container">
                <div className={styles.board}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <TaskColumn
                            title="Queue"
                            droppableId="queue"
                            tasks={queue}
                            createTaskFoo={createTask}
                            openTaskInfoModal={openTaskInfoModal}
                        />

                        <TaskColumn
                            title="Development"
                            droppableId="development"
                            tasks={development}
                            createTaskFoo={createTask}
                            openTaskInfoModal={openTaskInfoModal}
                        />

                        <TaskColumn
                            title="Done"
                            droppableId="done"
                            tasks={done}
                            createTaskFoo={createTask}
                            openTaskInfoModal={openTaskInfoModal}
                        />
                    </DragDropContext>
                </div>
            </div>

            <Modal
                show={taskInfoModal && taskInfo !== null}
                onClose={() => {
                    setTaskInfoModal(false)
                    setTimeout(() => setTaskInfo(null), 300)
                }}
            >
                <div className={styles.taskInfo}>
                    <div className={styles.taskInfo_titleWrap}>
                        <h2>{taskInfo && taskInfo.title}</h2>
                    </div>
                    <ul className={styles.taskInfo_info}>
                        <li>в колонке {taskInfo && taskInfo.column}</li>
                        <li>
                            Дата создания:{' '}
                            {taskInfo && format(parseISO(taskInfo.createdAt), 'dd.MM.yyyy')}
                        </li>
                    </ul>
                    <p></p>
                </div>
            </Modal>
        </>
    )
}

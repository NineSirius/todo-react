import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { ProjectT } from 'types/ProjectT'
import { TaskT } from 'types/TaskT'
import styles from './ProjectPage.module.sass'
import { TaskColumn } from './TaskColumn'
import { Modal } from 'components/UI/Modal'
import { format, parseISO } from 'date-fns'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button } from 'components/UI/Button'
import { TaskCard } from './TaskCard'

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
    const [taskInfoDesc, setTaskInfoDesc] = useState<string>('')
    const [taskInfoDescEditable, setTaskInfoDescEditable] = useState<boolean>(false)
    const [archiveModal, setArchiveModal] = useState<boolean>(false)

    const inputRef = useRef<HTMLDivElement>(null)
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

    const saveProjectInfo = () => {
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

        saveProjectInfo()
    }

    const createTask = (column: string, title: string, description?: string) => {
        if (projectInfo) {
            const newTask: TaskT = {
                id: Date.now().toString(),
                title: title,
                description: description ? description : '',
                column,
                position: 0,
                createdAt: new Date().toJSON(),
                isArchived: false,
                number: projectInfo.tasks.length + 1,
                isCompleted: false,
            }

            newTask.position =
                column === 'queue'
                    ? queue.length
                    : column === 'done'
                    ? done.length
                    : development.length

            const projectInfoCopy = { ...projectInfo }
            projectInfoCopy.tasks.push(newTask)
            setProjectInfo(projectInfoCopy)

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

            saveProjectInfo()
        }
    }

    const changeTaskInfo = (property: string, value: any) => {
        if (taskInfo) {
            const taskInfoCopy = { ...taskInfo }
            //@ts-ignore
            taskInfoCopy[property] = value
            setTaskInfo(taskInfoCopy)
        }
    }

    const saveTaskInfo = () => {
        if (projectInfo && taskInfo) {
            const projectInfoCopy = { ...projectInfo }
            const index = projectInfo.tasks.findIndex((task) => task.id === taskInfo.id)
            console.log(index)
            projectInfo.tasks.splice(index, 1, taskInfo)
            setProjectInfo(projectInfoCopy)
            saveProjectInfo()
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    const handleBlur = (e: any) => {
        if (inputRef.current && projectInfo) {
            const newText = inputRef.current.innerHTML.trim()
            if (newText === '') {
                inputRef.current.innerText = 'b'
            } else {
                const projectInfoCopy = { ...projectInfo }
                projectInfoCopy.title = newText
                setProjectInfo(projectInfoCopy)
            }
            saveProjectInfo()
        }
    }

    const deleteTask = (taskId: string) => {
        if (projectInfo) {
            const projectInfoCopy = { ...projectInfo }
            const deleteTaskIndex = projectInfoCopy.tasks.findIndex((task) => task.id === taskId)
            if (deleteTaskIndex) {
                projectInfo?.tasks.splice(deleteTaskIndex, 1)
            }
            saveProjectInfo()
            setTaskInfoModal(false)
        }
    }

    return (
        <>
            <div className="container">
                <div className={styles.projectTitle}>
                    <div
                        ref={inputRef}
                        onKeyPress={handleKeyPress}
                        onBlur={handleBlur}
                        contentEditable
                        className={styles.projectTitle_title}
                    >
                        {projectInfo?.title}
                    </div>
                    <Button onClick={() => setArchiveModal(true)}>Архив</Button>
                </div>
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
                    setTaskInfoDescEditable(false)
                    setTaskInfoDesc('')
                    saveTaskInfo()

                    setTimeout(() => setTaskInfo(null), 300)
                }}
            >
                {taskInfo && (
                    <div className={styles.taskInfo}>
                        <p>
                            Задача номер{' '}
                            <span className={styles.taskInfo_taskNumber}>{taskInfo.number}</span>
                        </p>
                        <div className={styles.taskInfo_titleWrap}>
                            <input
                                className={styles.taskInfo_title}
                                value={taskInfo.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    changeTaskInfo('title', e.target.value)
                                }
                            />
                        </div>

                        <div className={styles.taskInfo_controls}>
                            {!taskInfo.isArchived ? (
                                <Button onClick={() => changeTaskInfo('isArchived', true)}>
                                    Архивировать
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={() => changeTaskInfo('isArchived', false)}>
                                        Вернуть
                                    </Button>
                                    <Button onClick={() => deleteTask(taskInfo.id)}>Удалить</Button>
                                </>
                            )}
                        </div>

                        <ul className={styles.taskInfo_info}>
                            {/* <li>в колонке {taskInfo && taskInfo.column}</li> */}
                            <li>
                                Дата создания:{' '}
                                {taskInfo &&
                                    format(parseISO(taskInfo.createdAt), 'dd.MM.yyyy в HH:mm')}
                            </li>
                        </ul>

                        <div className={styles.taskInfo_description}>
                            <h3>Описание</h3>

                            <div className={styles.editor}>
                                <ReactQuill
                                    theme="snow"
                                    style={{ maxWidth: '100%' }}
                                    //@ts-ignore
                                    value={taskInfo.description}
                                    onChange={(value) => changeTaskInfo('description', value)}
                                />
                                {/* <div className={styles.buttons}>
                                    <Button
                                        onClick={() => {
                                            changeTaskInfo('description', taskInfoDesc)
                                            setTaskInfoDescEditable(false)
                                        }}
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setTaskInfoDescEditable(false)
                                            setTaskInfoDesc('')
                                        }}
                                    >
                                        Отменить
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* <Modal show={archiveModal} onClose={() => setArchiveModal(false)}>
                <div className={styles.taskArchive}>
                    <h3>Архив</h3>

                    <div className={styles.taskArchive_tasks}>
                        {projectInfo &&
                            projectInfo.tasks
                                .filter((task) => task.isArchived)
                                .map((task, index) => (
                                    <TaskCard
                                        title={task.title}
                                        index={index}
                                        id={task.id}
                                        onClick={() => openTaskInfoModal(task.id)}
                                    />
                                ))}
                    </div>
                </div>
            </Modal> */}
        </>
    )
}

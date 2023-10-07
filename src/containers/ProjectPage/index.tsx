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
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { TaskColumnT } from 'types/TaskColumnT'
import { CreateTaskColumn } from './CreateTaskColumn'
import { v4 as uuidv4 } from 'uuid'
import { MdOutlineArchive } from 'react-icons/md'
import { TaskCard } from './TaskCard'
import { usePrompt } from 'containers/PromptProvider'
import { enqueueSnackbar } from 'notistack'

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
    const [taskColumns, setTaskColumns] = useState<TaskColumnT[]>([])
    const [taskArchive, setTaskArchive] = useState<TaskT[]>([])

    const { openPrompt } = usePrompt()
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
        }
    }

    const renderTasksFromProject = (project: ProjectT) => {
        setTaskColumns(
            project.columns.map((column) => {
                return {
                    ...column,
                    tasks: project.tasks
                        .filter((task) => task.column.id === column.id)
                        .sort((x, y) => x.position - y.position),
                }
            }),
        )
    }

    const initialColumnsState = [
        { id: 'dsa82ui381', title: 'queue', tasks: [] },
        { id: '2312dsa', title: 'development', tasks: [] },
        { id: '213189dsa2]q', title: 'done', tasks: [] },
    ]

    useEffect(() => {
        const projects = localStorage.getItem('projects')
        if (projects) {
            const parsedProjects = JSON.parse(projects)
            const project: ProjectT = parsedProjects.find((item: ProjectT) => item.id === id)
            if (project) {
                setProjectInfo(project)
                if (project.columns) {
                    renderTasksFromProject(project)
                } else {
                    setTaskColumns(initialColumnsState)
                }
                setTaskArchive(project.tasks.filter((task) => task.isArchived))
            }
        }
    }, [id])

    const handleDragEnd = (result: any) => {
        console.log(result)

        if (!result.destination) return

        const { source, destination } = result
        const movedTask = projectInfo?.tasks.find((task) => task.id === result.draggableId)
        const destinationColumnId = null

        if (source.droppableId === destination.droppableId && movedTask) {
            const sourceColumn = taskColumns.filter((column) => column.id === source.droppableId)[0]
            console.log(sourceColumn)

            if (sourceColumn) {
                const updatedTasks = reorder(sourceColumn.tasks, source.index, destination.index)
                updatedTasks.forEach((task, index) => {
                    task.position = index
                })
                sourceColumn.tasks = updatedTasks
            }

            setTaskColumns((prev: any) => {
                const taskColumnsCopy = [...prev]
                const index = taskColumnsCopy.findIndex((column) => column.id === sourceColumn.id)
                taskColumns[index] = sourceColumn
                return taskColumnsCopy
            })
        } else if (movedTask) {
            const destinationColumn = taskColumns.find(
                (column) => column.id === destination.droppableId,
            )

            if (destinationColumn) {
                movedTask.column = { id: destination.droppableId, title: destinationColumn?.title }
                movedTask.position = destination.index
            }

            const sourceColumnTasks = taskColumns.filter(
                (column) => column.id === source.droppableId,
            )[0]
            const destinationColumnTasks = taskColumns.filter(
                (column) => column.id === destination.droppableId,
            )[0]

            const updatedSourceTasks = [...sourceColumnTasks.tasks]
            updatedSourceTasks.splice(source.index, 1)

            const updatedDestinationTasks = [...destinationColumnTasks.tasks]
            updatedDestinationTasks.splice(destination.index, 0, movedTask)

            setTaskColumns((prev) => {
                const taskColumnsCopy = [...prev]
                const sourceColumnIndex = taskColumnsCopy.findIndex(
                    (column) => column.id === sourceColumnTasks.id,
                )
                const destinationColumnIndex = taskColumnsCopy.findIndex(
                    (column) => column.id === destinationColumnTasks.id,
                )
                taskColumnsCopy[sourceColumnIndex].tasks = updatedSourceTasks
                taskColumnsCopy[destinationColumnIndex].tasks = updatedDestinationTasks
                return taskColumnsCopy
            })
        }

        saveProjectInfo()
    }

    const createColumn = (columnName: string) => {
        if (projectInfo) {
            const newColumn: TaskColumnT = {
                title: columnName,
                id: uuidv4(),
                tasks: [],
            }

            setProjectInfo((prev: any) => {
                return { ...prev, columns: [...prev.columns, newColumn] }
            })
            setTaskColumns((prev) => [...prev, newColumn])

            saveProjectInfo()
        }
    }

    const editColumnTitle = (columnTitle: string, columnId: string) => {
        setTaskColumns((prev: TaskColumnT[]) => {
            const taskColumnsCopy = [...prev]
            const index = taskColumnsCopy.findIndex((column) => column.id === columnId)
            taskColumnsCopy[index].title = columnTitle

            if (projectInfo) {
                setProjectInfo((prev: any) => {
                    const projectInfoCopy = { ...prev }
                    projectInfoCopy.columns[index].title = columnTitle
                    projectInfoCopy.tasks = projectInfoCopy.tasks.map((task: TaskT) => {
                        if (task.column.id === columnId) {
                            return { ...task, column: { title: columnTitle, id: columnId } }
                        } else {
                            return { ...task }
                        }
                    })

                    return projectInfoCopy
                })
            }
            return taskColumnsCopy
        })
        saveProjectInfo()
    }

    const createTask = (
        column: { id: string; title: string },
        title: string,
        description?: string,
    ) => {
        if (projectInfo) {
            const newTask: TaskT = {
                id: uuidv4(),
                title: title,
                description: description ? description : '',
                column: {
                    title: column.title,
                    id: column.id,
                },
                position: 0,
                createdAt: new Date().toJSON(),
                isArchived: false,
                number: projectInfo.tasks.length + 1,
                isCompleted: false,
            }

            const destinationColumnIndex = taskColumns.findIndex(
                (taskColumn) => taskColumn.id === column.id,
            )
            newTask.position = taskColumns[destinationColumnIndex].tasks.length

            const projectInfoCopy = { ...projectInfo }
            projectInfoCopy.tasks.push(newTask)
            setProjectInfo(projectInfoCopy)

            setTaskColumns((prev: TaskColumnT[]) => {
                const taskColumnsCopy = [...prev]
                const index = taskColumnsCopy.findIndex((col) => col.id === column.id)
                taskColumnsCopy[index].tasks.push(newTask)
                return taskColumnsCopy
            })

            saveProjectInfo()
        }
    }

    const changeTaskInfo = (property: string, value: any, taskId: any) => {
        if (projectInfo) {
            const projectInfoCopy = { ...projectInfo }
            const taskIndex = projectInfoCopy.tasks.findIndex((task) => task.id === taskId)
            //@ts-ignore
            projectInfo.tasks[taskIndex][property] = value
            setProjectInfo(projectInfoCopy)
            renderTasksFromProject(projectInfo)
            saveProjectInfo()
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
            console.log(deleteTaskIndex)

            if (deleteTaskIndex >= 0) {
                console.log('' + projectInfo.tasks[deleteTaskIndex].id + ' = ' + taskId)
                projectInfoCopy.tasks.splice(deleteTaskIndex, 1)

                setProjectInfo(projectInfoCopy)
                saveProjectInfo()
                setTaskInfoModal(false)
                renderTasksFromProject(projectInfoCopy)
            } else {
                enqueueSnackbar('Не удалось удалить задачу', { variant: 'error' })
            }
        }
    }

    return (
        <>
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
                <Button onClick={() => setArchiveModal(true)} variant="default">
                    <MdOutlineArchive size={16} /> Архив
                </Button>
            </div>
            <div className={styles.board}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {taskColumns &&
                        taskColumns.map((column: TaskColumnT) => (
                            <TaskColumn
                                key={column.id}
                                id={column.id}
                                title={column.title}
                                droppableId={column.id}
                                tasks={column.tasks}
                                createTaskFoo={createTask}
                                openTaskInfoModal={openTaskInfoModal}
                                editColumnTitle={editColumnTitle}
                            />
                        ))}
                    <CreateTaskColumn createColumn={createColumn} />
                </DragDropContext>
            </div>

            <Modal
                title={
                    <p>
                        Задача номер{' '}
                        <span className={styles.taskInfo_taskNumber}>
                            {taskInfo && taskInfo.number}
                        </span>
                    </p>
                }
                show={taskInfoModal && taskInfo !== null}
                onClose={() => {
                    setTaskInfoModal(false)
                    setTaskInfoDescEditable(false)
                    setTaskInfoDesc('')
                    saveTaskInfo()
                    if (projectInfo) {
                        renderTasksFromProject(projectInfo)
                    }
                    setTimeout(() => setTaskInfo(null), 300)
                }}
            >
                {taskInfo && (
                    <div className={styles.taskInfo}>
                        <div className={styles.taskInfo_titleWrap}>
                            <input
                                className={styles.taskInfo_title}
                                value={taskInfo.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    changeTaskInfo('title', e.target.value, taskInfo.id)
                                }
                            />
                        </div>
                        <div className={styles.taskInfo_layout}>
                            <div className={styles.taskInfo_content}>
                                <ul className={styles.taskInfo_info}>
                                    <li>
                                        Дата создания:{' '}
                                        {taskInfo &&
                                            format(
                                                parseISO(taskInfo.createdAt),
                                                'dd.MM.yyyy в HH:mm',
                                            )}
                                    </li>
                                </ul>

                                <div
                                    className={styles.taskInfo_description}
                                    style={{ marginTop: 15 }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <h3>Описание</h3>

                                        {!taskInfoDescEditable && (
                                            <Button
                                                variant="default"
                                                onClick={() => {
                                                    setTaskInfoDescEditable(true)
                                                    setTaskInfoDesc(taskInfo.description)
                                                }}
                                            >
                                                Изменить
                                            </Button>
                                        )}
                                    </div>

                                    {taskInfoDescEditable ? (
                                        <div className={styles.editor}>
                                            <ReactQuill
                                                theme="snow"
                                                style={{ maxWidth: '100%' }}
                                                //@ts-ignore
                                                value={taskInfoDesc}
                                                onChange={(value) => setTaskInfoDesc(value)}
                                            />

                                            <div className={styles.editor_controls}>
                                                <Button
                                                    onClick={() => {
                                                        changeTaskInfo(
                                                            'description',
                                                            taskInfoDesc,
                                                            taskInfo.id,
                                                        )
                                                        setTaskInfoDescEditable(false)
                                                    }}
                                                >
                                                    Сохранить
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    onClick={() => {
                                                        setTaskInfoDesc('')
                                                        setTaskInfoDescEditable(false)
                                                    }}
                                                >
                                                    Отмена
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Markdown
                                            className={styles.description}
                                            rehypePlugins={[rehypeRaw]}
                                        >
                                            {taskInfo.description}
                                        </Markdown>
                                    )}
                                </div>
                            </div>
                            <div className={styles.taskInfo_controls}>
                                <div className={styles.taskInfo_controls__column}>
                                    <h4>Действия</h4>
                                    {!taskInfo.isArchived ? (
                                        <Button
                                            onClick={() => {
                                                changeTaskInfo('isArchived', true, taskInfo.id)
                                                setTaskArchive((prev) => [
                                                    ...prev,
                                                    { ...taskInfo, isArchived: true },
                                                ])
                                            }}
                                            variant="default"
                                        >
                                            Архивировать
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() =>
                                                    changeTaskInfo('isArchived', false, taskInfo.id)
                                                }
                                            >
                                                Вернуть
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        onClick={() => {
                                            setTaskInfoModal(false)
                                            openPrompt(
                                                'Удаление задачи',
                                                'Вы действительно хотите удалить задачу? После удаления вся информация с ней связанная исчезнет без возможности возврата. После подтверждения, отмена невозможна',
                                                () => {
                                                    deleteTask(taskInfo.id)
                                                },
                                            )
                                        }}
                                        variant="error"
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title={<h3>Архив</h3>}
                show={archiveModal}
                onClose={() => setArchiveModal(false)}
            >
                <div className={styles.taskArchive}>
                    <div className={styles.taskArchive_tasks}>
                        {taskArchive.length > 0 ? (
                            taskArchive.map((task, index) => (
                                <div className={styles.taskCard}>
                                    <p>{task.title}</p>
                                    <div className={styles.taskCard_archiveTaskControls}>
                                        <button
                                            onClick={() => {
                                                changeTaskInfo('isArchived', false, task.id)
                                                setTaskArchive((prev: TaskT[]) => {
                                                    const taskArchiveCopy = [...prev]
                                                    taskArchiveCopy.splice(index, 1)
                                                    return taskArchiveCopy
                                                })
                                            }}
                                        >
                                            Вернуть
                                        </button>
                                        <button
                                            onClick={() =>
                                                openPrompt(
                                                    'Удаление задачи',
                                                    'Вы действительно хотите удалить задачу? После удаления вся информация с ней связанная исчезнет без возможности возврата. После подтверждения, отмена невозможна',
                                                    () => {
                                                        deleteTask(task.id)
                                                        setTaskArchive((prev: TaskT[]) => {
                                                            const taskArchiveCopy = [...prev]
                                                            taskArchiveCopy.splice(index, 1)
                                                            return taskArchiveCopy
                                                        })
                                                    },
                                                )
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h4 className={styles.taskArchive_empty}>Архив пуст</h4>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    )
}

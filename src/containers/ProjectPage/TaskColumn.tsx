import React, { useState, useRef, useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { TaskT } from 'types/TaskT'
import { TaskCard } from './TaskCard'
import styles from './ProjectPage.module.sass'
import { Modal } from 'components/UI/Modal'
import { Button } from 'components/UI/Button'
import { CreateTaskCard } from './CreateTaskCard'

interface TaskColumnProps {
    id: string
    title: string
    tasks: TaskT[]
    droppableId: string
    createTaskFoo: (
        column: { title: string; id: string },
        title: string,
        description?: string,
    ) => void
    openTaskInfoModal: (id: string) => void
    editColumnTitle: (columnTitle: string, columnId: string) => void
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
    id,
    title,
    tasks,
    droppableId,
    createTaskFoo,
    openTaskInfoModal,
    editColumnTitle,
}): JSX.Element => {
    const [createTaskModal, setCreateTaskModal] = useState(false)
    const [columnTitle, setColumnTitle] = useState<string>(title)
    const [tasksLength, setTaskLength] = useState<number>(0)

    const createTaskRef = useRef<any>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (createTaskRef.current && !createTaskRef.current.contains(event.target as Node)) {
            setCreateTaskModal(false)
        }
    }

    const handleCreateTaskClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCreateTaskModal(true)
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <>
            <div className={styles.column}>
                <Droppable droppableId={droppableId}>
                    {(provided) => (
                        <>
                            <div className={styles.columnTitle}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={columnTitle}
                                    placeholder="Введите заголовок колонки"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setColumnTitle(e.target.value)
                                    }
                                    onBlur={() => editColumnTitle(columnTitle, id)}
                                />
                                <span>
                                    {tasks.filter((task) => task.isArchived === false).length}
                                </span>
                            </div>
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                id={droppableId}
                                className={styles.column_tasks}
                            >
                                {tasks.map((task, index) => {
                                    if (!task.isArchived) {
                                        return (
                                            <TaskCard
                                                title={task.title}
                                                id={task.id}
                                                index={index}
                                                key={task.id}
                                                onClick={openTaskInfoModal}
                                            />
                                        )
                                    }
                                })}
                                {provided.placeholder}
                            </div>
                        </>
                    )}
                </Droppable>

                <div ref={createTaskRef} id={`${droppableId}-createTaskRef`}>
                    {createTaskModal ? (
                        <CreateTaskCard
                            createTaskFoo={createTaskFoo}
                            cancel={() => setCreateTaskModal(false)}
                            column={{ id: id, title: droppableId }}
                        />
                    ) : (
                        <button
                            onClick={handleCreateTaskClick}
                            className={styles.createTask_button}
                        >
                            Создать задачу
                        </button>
                    )}
                </div>
            </div>

            {/* <Modal show={createTaskModal} onClose={toggleCreateTaskModal}>
                <form onSubmit={createTaskSubmit} className={styles.createTaskForm}>
                    <h4>Создание задачи</h4>

                    <label>
                        <span>Заголовок задачи*</span>
                        <input
                            type="text"
                            required
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setTaskTitle(e.target.value)
                            }
                        />
                    </label>

                    <label>
                        <span>Описание задачи*</span>
                        <input
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setTaskDescription(e.target.value)
                            }
                        />
                    </label>

                    <Button>Создать</Button>
                </form>
            </Modal> */}
        </>
    )
}

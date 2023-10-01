import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { TaskT } from 'types/TaskT'
import { TaskCard } from './TaskCard'
import styles from './ProjectPage.module.sass'
import { Modal } from 'components/UI/Modal'

interface TaskColumnProps {
    title: string
    tasks: TaskT[]
    droppableId: string
    createTaskFoo: (column: string, title: string, description?: string) => void
    openTaskInfoModal: (id: string) => void
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
    title,
    tasks,
    droppableId,
    createTaskFoo,
    openTaskInfoModal,
}): JSX.Element => {
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [createTaskModal, setCreateTaskModal] = useState(false)

    const toggleCreateTaskModal = () => setCreateTaskModal(!createTaskModal)

    const createTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (taskTitle !== '') {
            createTaskFoo(droppableId, taskTitle, taskDescription)
        }
    }

    return (
        <>
            <div className={styles.column}>
                <h3>{title}</h3>
                <Droppable droppableId={droppableId}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            id={droppableId}
                            className={styles.column_tasks}
                        >
                            {tasks.map((task, index) => (
                                <TaskCard
                                    position={task.position}
                                    title={task.title}
                                    description={task.description}
                                    id={task.id}
                                    column={task.column}
                                    index={index}
                                    key={task.id}
                                    onClick={openTaskInfoModal}
                                    createdAt={task.createdAt}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <button onClick={toggleCreateTaskModal}>Create Task</button>
            </div>

            <Modal show={createTaskModal} onClose={toggleCreateTaskModal}>
                <form onSubmit={createTaskSubmit}>
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

                    <button>Создать</button>
                </form>
            </Modal>
        </>
    )
}

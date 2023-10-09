import React, { useState, useRef, useEffect } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { TaskT } from 'types/TaskT'
import { TaskCard } from './TaskCard'
import styles from './ProjectPage.module.sass'
import { Modal } from 'components/UI/Modal'
import { Button } from 'components/UI/Button'
import { CreateTaskCard } from './CreateTaskCard'
import { Menu, MenuItem } from 'components/UI/Menu'
import { MdMoreHoriz } from 'react-icons/md'
import { IconButton } from 'components/UI/IconButtom/IconButton'
import { enqueueSnackbar } from 'notistack'
import { usePrompt } from 'containers/PromptProvider'

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
    deleteColumn: (columnId: string) => void
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
    id,
    title,
    tasks,
    droppableId,
    createTaskFoo,
    openTaskInfoModal,
    editColumnTitle,
    deleteColumn,
}): JSX.Element => {
    const [createTaskModal, setCreateTaskModal] = useState(false)
    const [columnTitle, setColumnTitle] = useState<string>(title)
    const [tasksLength, setTaskLength] = useState<number>(0)

    const { openPrompt } = usePrompt()

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
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <>
                        <div
                            className={styles.column}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            id={droppableId}
                        >
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
                                <Menu
                                    title={
                                        <IconButton variant="default">
                                            <MdMoreHoriz size={18} />
                                        </IconButton>
                                    }
                                >
                                    <MenuItem
                                        onClick={() =>
                                            openPrompt(
                                                'Удаление колнки',
                                                'Удаляя колонку, вы также удалите всю информация с ней связаную, в том числе и задачи. Отмена невозможна',
                                                () => deleteColumn(id),
                                            )
                                        }
                                    >
                                        Удалить колонку
                                    </MenuItem>
                                </Menu>
                            </div>
                            <div className={styles.column_tasks}>
                                {tasks.map((task, index) => {
                                    if (!task.isArchived) {
                                        return (
                                            <TaskCard
                                                title={task.title}
                                                description={task.description}
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

                            <div ref={createTaskRef} id={`${droppableId}-createTaskRef`}>
                                {createTaskModal ? (
                                    <CreateTaskCard
                                        createTaskFoo={createTaskFoo}
                                        cancel={() => setCreateTaskModal(false)}
                                        column={{ id, title }}
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
                    </>
                )}
            </Droppable>
        </>
    )
}

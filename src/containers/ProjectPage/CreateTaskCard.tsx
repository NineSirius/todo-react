import React, { useRef, useState, useEffect } from 'react'
import styles from './ProjectPage.module.sass'
import { Button } from 'components/UI/Button'
import { MdClose } from 'react-icons/md'
import { IconButton } from 'components/UI/IconButtom/IconButton'

interface createTaskCardProps {
    createTaskFoo: (
        column: { title: string; id: string },
        title: string,
        description?: string,
    ) => void
    cancel: () => void
    column: { title: string; id: string }
}

export const CreateTaskCard: React.FC<createTaskCardProps> = ({
    createTaskFoo,
    cancel,
    column,
}): JSX.Element => {
    const [taskTitle, setTaskTitle] = useState<string>('')

    return (
        <>
            <div className={styles.taskCard}>
                <input
                    type="text"
                    placeholder="Введите заголовок для этой задачи"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTaskTitle(e.target.value)
                    }
                />
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Button
                    onClick={() => {
                        createTaskFoo(column, taskTitle)
                        cancel()
                    }}
                >
                    Добавить карточку
                </Button>
                <IconButton onClick={cancel}>
                    <MdClose size={16} />
                </IconButton>
            </div>
        </>
    )
}

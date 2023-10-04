import React, { useRef, useState, useEffect } from 'react'
import styles from './ProjectPage.module.sass'
import { Button } from 'components/UI/Button'

interface createTaskCardProps {
    createTaskFoo: (column: string, title: string, description?: string) => void
    cancel: () => void
    column: string
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
                <Button onClick={cancel}>X</Button>
            </div>
        </>
    )
}

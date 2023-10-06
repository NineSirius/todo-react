import React, { useState } from 'react'
import styles from './ProjectPage.module.sass'
import { Button } from 'components/UI/Button'
import { MdClose } from 'react-icons/md'
import { IconButton } from 'components/UI/IconButtom/IconButton'

interface CreateTaskColumnProps {
    createColumn: (columnName: string) => void
}

export const CreateTaskColumn: React.FC<CreateTaskColumnProps> = ({ createColumn }) => {
    const [taskColumnTitle, setTaskColumnTitle] = useState<string>('')
    const [createTaskColumnStatus, setCreateTaskColumnStatus] = useState<boolean>()

    const toggle = () => setCreateTaskColumnStatus(!createTaskColumnStatus)

    if (createTaskColumnStatus) {
        return (
            <div className={styles.createTaskColumn}>
                <input
                    placeholder="Введите заголов колонки"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTaskColumnTitle(e.target.value)
                    }
                />
                <div className={styles.createTaskColumn_controls}>
                    <Button onClick={() => createColumn(taskColumnTitle)}>Добавить колонку</Button>
                    <IconButton variant="default" onClick={toggle}>
                        <MdClose />
                    </IconButton>
                </div>
            </div>
        )
    } else
        return (
            <div className={styles.createTaskColumn} onClick={toggle}>
                <h4>Добавить еще колонку</h4>
            </div>
        )
}

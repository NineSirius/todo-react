import React from 'react'
import styles from './ProjectPage.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import { TaskT } from 'types/TaskT'

interface TaskCardProps {
    title: string
    index: any
    onClick: (id: string) => void
    id: string
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, id, index, onClick }) => {
    return (
        <>
            <Draggable draggableId={id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        className={styles.taskCard}
                        onClick={() => onClick(id)}
                    >
                        <div className={styles.titleWrap}>{title}</div>
                    </div>
                )}
            </Draggable>
        </>
    )
}

import React from 'react'
import styles from './ProjectPage.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import { TaskT } from 'types/TaskT'

interface TaskCardProps extends TaskT {
    index: any
    onClick: (id: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
    title,
    id,
    description,
    column,
    index,
    position,
    onClick,
}) => {
    return (
        <>
            <Draggable draggableId={id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        className={styles.task_card}
                        onClick={() => onClick(id)}
                    >
                        <div className={styles.title_wrap}>{title}</div>
                    </div>
                )}
            </Draggable>
        </>
    )
}

import React from 'react'
import styles from './ProjectPage.module.sass'
import { Draggable } from 'react-beautiful-dnd'
import { TaskT } from 'types/TaskT'
import { MdOutlineFormatAlignLeft } from 'react-icons/md'

interface TaskCardProps {
    title: React.ReactNode
    description: string
    index: any
    onClick: (id: string) => void
    id: string
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, description, id, index, onClick }) => {
    console.log(description)

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
                        <div className={styles.titleWrap}>
                            <div className={styles.title}>{title}</div>
                            <div className={styles.titleWrap_info}>
                                {description.length > 0 && (
                                    <div className={styles.titleWrap_infoItem}>
                                        <MdOutlineFormatAlignLeft />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    )
}

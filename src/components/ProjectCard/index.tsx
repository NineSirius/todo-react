import React from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './ProjectCard.module.sass'
import { Menu, MenuItem } from 'components/UI/Menu'
import MenuIcon from './menu-icon.png'
import { Draggable } from 'react-beautiful-dnd'

interface ProjectCardProps extends ProjectT {
    index: number
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
    deleteProject?: () => void
    editProject?: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    title,
    index,
    createdAt,
    tasks,
    onClick,
    deleteProject,
    editProject,
}) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    onClick={onClick}
                    className={styles.card}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                >
                    <div className={styles.title_wrap}>
                        <h4>{title}</h4>
                        {editProject && deleteProject && (
                            <Menu
                                title={<img src={MenuIcon} alt="menu icon" style={{ width: 25 }} />}
                            >
                                <MenuItem onClick={editProject}>Изменить</MenuItem>
                                <MenuItem onClick={deleteProject}>Удалить</MenuItem>
                                {/* <MenuItem onClick={deleteProject}>Поделиться</MenuItem> */}
                            </Menu>
                        )}
                    </div>
                    <p>{tasks.length > 0 ? `${tasks.length} задач` : 'Ни одной задачи'}</p>
                </div>
            )}
        </Draggable>
    )
}

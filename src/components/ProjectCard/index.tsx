import React from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './ProjectCard.module.sass'
import { Menu, MenuItem } from 'components/UI/Menu'

interface ProjectCardProps extends ProjectT {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
    deleteProject?: () => void
    editProject?: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    title,
    createdAt,
    tasks,
    bg,
    onClick,
    deleteProject,
    editProject,
}) => {
    return (
        <div onClick={onClick} className={styles.card} style={{ backgroundColor: bg.color }}>
            <div className={styles.title_wrap}>
                <h4>{title}</h4>
                {editProject && deleteProject && (
                    <Menu
                        title={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1.25em"
                                viewBox="0 0 128 512"
                            >
                                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                        }
                    >
                        <MenuItem onClick={editProject}>Изменить</MenuItem>
                        <MenuItem onClick={deleteProject}>Удалить</MenuItem>
                        {/* <MenuItem onClick={deleteProject}>Поделиться</MenuItem> */}
                    </Menu>
                )}
            </div>
            <p>{tasks.length > 0 ? `${tasks.length} задач` : 'Ни одной задачи'}</p>
        </div>
    )
}

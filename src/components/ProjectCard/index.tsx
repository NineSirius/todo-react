import React from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './ProjectCard.module.sass'
import { Menu, MenuItem } from 'components/UI/Menu'
import MenuIcon from './menu-icon.png'

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
                    <Menu title={<img src={MenuIcon} alt="menu icon" style={{ width: 25 }} />}>
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

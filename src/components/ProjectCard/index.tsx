import React from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './ProjectCard.module.sass'
import { Menu, MenuItem } from 'components/UI/Menu'
import MenuIcon from './menu-icon.png'
import { MdMoreHoriz, MdTaskAlt } from 'react-icons/md'

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
        <div onClick={onClick} className={styles.card}>
            <div className={styles.title_wrap}>
                <h4>{title}</h4>
                {editProject && deleteProject && (
                    <Menu title={<MdMoreHoriz size={28} className={styles.menu} />}>
                        <MenuItem onClick={editProject}>Изменить</MenuItem>
                        <MenuItem onClick={deleteProject}>Удалить</MenuItem>
                        {/* <MenuItem onClick={deleteProject}>Поделиться</MenuItem> */}
                    </Menu>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.info_item}>
                    <MdTaskAlt /> {tasks.length}
                </div>
            </div>
        </div>
    )
}

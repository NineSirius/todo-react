import React from 'react'
import { ProjectT } from '../../types/ProjectT'
import styles from './ProjectCard.module.sass'

interface ProjectCardProps extends ProjectT {
    onClick: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    title,
    createdAt,
    tasks,
    bg,
    onClick,
}) => {
    return (
        <div onClick={onClick} className={styles.card} style={{ backgroundColor: bg.color }}>
            <h4>{title}</h4>
            <p>{tasks.length > 0 ? `${tasks.length} задач` : 'Ни одной задачи'}</p>
        </div>
    )
}

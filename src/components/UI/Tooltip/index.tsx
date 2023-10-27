import React from 'react'
import styles from './Tooltip.module.sass'

type TooltipProps = {
    title: string
    children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ title, children }) => {
    return (
        <div className={styles.tooltip}>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>{children}</div>
        </div>
    )
}

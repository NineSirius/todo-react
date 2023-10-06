import React from 'react'
import styles from './IconButton.module.sass'

interface IconButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    variant?: 'primary' | 'warning' | 'success' | 'error' | 'default'
}

export const IconButton: React.FC<IconButtonProps> = ({
    children,
    onClick,
    className,
    variant,
}): JSX.Element => {
    return (
        <button
            className={`${className && className} ${styles.button} ${variant && styles[variant]}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

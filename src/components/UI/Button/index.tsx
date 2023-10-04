import React from 'react'
import styles from './Button.module.sass'

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    variant?: 'primary' | 'warning' | 'success' | 'error' | 'default'
}

export const Button: React.FC<ButtonProps> = ({
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

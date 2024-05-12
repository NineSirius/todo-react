import React from 'react'
import styles from './Button.module.sass'
import clsx from "clsx"

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    buttonType?: "submit" | "button"
    variant?: 'primary' | 'warning' | 'success' | 'error' | 'default'
    style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className,
    buttonType,
    variant,
    style,
}): JSX.Element => {
    return (
        <button //${className && className} ${styles.button} ${variant && styles[variant]}
            className={clsx(styles.button, className && className, variant && styles[variant])}
            onClick={onClick}
            type={buttonType}
            style={style}
        >
            {children}
        </button>
    )
}

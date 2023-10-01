import React from 'react'

interface ButtonProps {
    children: React.ReactNode
    onClick: () => void
    className: string
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className }): JSX.Element => {
    return <button className={className}>Button</button>
}

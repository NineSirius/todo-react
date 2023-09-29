import React from 'react'
import { useState, useRef, useEffect } from 'react'
import styles from './Menu.module.sass'

type MenuProps = {
    title: React.ReactNode
    children: React.ReactNode
}

export const Menu: React.FC<MenuProps> = ({ title, children }): JSX.Element => {
    const [show, setShow] = useState<boolean>(false)

    const menuRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShow(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    const toggleShow = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        setShow(!show)
    }

    return (
        <div className={styles.menu} ref={menuRef}>
            <div className={styles.menu_title} onClick={toggleShow}>
                {title}
            </div>
            <div className={`${styles.menu_content} ${show && styles.active}`}>{children}</div>
        </div>
    )
}

type MenuItemProps = {
    children: React.ReactNode
    onClick: () => void
}

export const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }): JSX.Element => {
    return (
        <div className={styles.menu_item} onClick={onClick}>
            {children}
        </div>
    )
}

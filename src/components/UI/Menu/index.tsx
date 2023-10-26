import React, { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useState, useRef, useEffect } from 'react'
import styles from './Menu.module.sass'

type MenuProps = {
    title: React.ReactNode
    children: React.ReactNode
    className?: string
}

export const Menu: React.FC<MenuProps> = ({ title, children, className }): JSX.Element => {
    const [show, setShow] = useState<boolean>(false)
    const [menuId, setMenuId] = useState<string | null>(null)
    const [clientWidth, setClientWidth] = useState<number>(0)
    const [left, setLeft] = useState<number>(0)
    const [right, setRight] = useState<number>(0)

    const menuRef = useRef<any>(null)
    const menuContentRef = useRef<any>(null)

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShow(false)
        }
    }, [])

    const toggleShow = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        setShow(!show)
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        setMenuId(() => uuidv4())
    }, [])

    useEffect(() => {
        if (menuContentRef.current) {
            setClientWidth(menuContentRef.current.clientWidth)
        }
    }, [menuContentRef])

    useEffect(() => {
        if (menuId) {
            const element = document.getElementById(menuId)

            if (element && show) {
                const rect = element.getBoundingClientRect()
                const windowWidth = window.innerWidth
                const distanceToLeft = rect.left
                const distanceToRight = windowWidth - rect.right
                setLeft(distanceToLeft)
                setRight(distanceToRight)
            }
        }
    }, [menuId, show])

    if (menuId) {
        return (
            <div className={`${styles.menu} ${className && className}`} ref={menuRef} id={menuId}>
                <div className={styles.menu_title} onClick={toggleShow}>
                    {title}
                </div>
                <div
                    className={`${styles.menu_content} ${show && styles.active} ${
                        right < clientWidth ? styles.right : styles.left
                    }`}
                    ref={menuContentRef}
                    // @ts-ignore
                >
                    {children}
                </div>
            </div>
        )
    } else {
        // eslint-disable-next-line jsx-a11y/heading-has-content
        return <h4></h4>
    }
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

import React, { useCallback } from 'react'
import { useState, useRef, useEffect } from 'react'
import styles from './Menu.module.sass'
import { v4 as uuidv4 } from 'uuid'
import clsx from "clsx"

type MenuProps = {
    title: React.ReactNode
    children: React.ReactNode
    className?: string
}

export const Menu: React.FC<MenuProps> = ({ title, children, className }): JSX.Element => {
    const [show, setShow] = useState<boolean>(false)
    const [menuId, setMenuId] = useState<string | null>(null)
    const [position, setPosition] = useState<any>({ top: 0, left: 0 })
    const [menuWidth, setMenuWidth] = useState<number>(0)

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
        if (show && menuRef.current) {
            const dropdownRect = menuRef.current.getBoundingClientRect();
            const spaceLeft = dropdownRect.left;


            const left = spaceLeft + menuContentRef.current.clientWidth
            const top = dropdownRect.bottom;

            setPosition({ top, left, width: menuContentRef.current.clientWidth, body: document.body.clientWidth });
            console.log({ ref: menuRef.current })
            console.log({ top, left, screen: window.innerWidth })
        }
    }, [show]);

    if (menuId) {
        return (
            <div className={`${styles.menu} ${className && className}`} ref={menuRef} id={menuId}>
                <div className={styles.menu_title} onClick={toggleShow}>
                    {title}
                </div>
                <div
                    className={clsx(styles.menu_content, show && styles.active, position.left < position.body ? styles.left : styles.right)}
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

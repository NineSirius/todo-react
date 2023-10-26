import React from 'react'
import styles from './Navbar.module.sass'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={`${styles.navbar_content} container`}>
                <div className={styles.left}>
                    <Link to="/" className={styles.logo}>
                        ToDo
                    </Link>
                    <div className={styles.navbar_links}>
                        <Link to="/">Доски</Link>
                        {/* <Link to="/">Чек-листы</Link> */}
                    </div>
                </div>

                <div className={styles.right}>
                    {/* <Menu title={<span>Тема</span>}>
                        <MenuItem onClick={() => alert('soon')}>Светлая</MenuItem>
                        <MenuItem onClick={() => alert('soon')}>Тёмная</MenuItem>
                    </Menu> */}
                    <Link to="https://github.com/NineSirius/todo-react" target="_blank">
                        GitHub
                    </Link>
                </div>
            </div>
        </div>
    )
}

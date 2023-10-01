import React from 'react'
import styles from './Navbar.module.sass'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={`${styles.navbar_content} container`}>
                <div className={styles.left}>
                    <h3>ToDO</h3>

                    <div className={styles.navbar_links}>
                        <Link to="/">Проекты</Link>
                    </div>
                </div>

                <div className={styles.right}>
                    <Link to="/">GitHub</Link>
                </div>
            </div>
        </div>
    )
}

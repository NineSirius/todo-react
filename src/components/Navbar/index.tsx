import styles from './Navbar.module.sass'
import { Link } from 'react-router-dom'
import { FaCog, FaGithub } from "react-icons/fa"
import clsx from "clsx"

export const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={`${styles.navbar_content} container`}>
                <div className={styles.left}>
                    <Link to="/" className={clsx(styles.logo, styles.link)} >
                        ToDo
                    </Link>
                    <div className={styles.navbar_links}>
                        <Link to="/" className={styles.link}>Проекты</Link>
                        {/* <Link to="/">Чек-листы</Link> */}
                    </div>
                </div>

                <div className={styles.right}>
                    {/* <Menu title={<span>Тема</span>}>
                        <MenuItem onClick={() => alert('soon')}>Светлая</MenuItem>
                        <MenuItem onClick={() => alert('soon')}>Тёмная</MenuItem>
                    </Menu> */}
                    <Link to="https://github.com/NineSirius/todo-react" target="_blank" className={styles.link}>
                        <FaGithub />
                        GitHub
                    </Link>
                    <button className={styles.link}><FaCog size={16} /></button>
                </div>
            </div>
        </div>
    )
}

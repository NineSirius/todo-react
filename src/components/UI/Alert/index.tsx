import { Button } from "../Button"
import styles from "./Alert.module.sass"
import clsx from "clsx"
import { MdClose } from 'react-icons/md'

type AlertProps = {
    variant?: "info" | "warning" | "success" | "error" | "default"
    children: React.ReactNode
    onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({ variant, children, onClose }): JSX.Element => {
    return (
        <div className={clsx(styles.alert, variant ? styles[variant] : styles.default)}>
            <p>{children}</p>
            <div className={styles.controls}>
                {onClose && <Button variant="default" onClick={onClose}><MdClose size={18} /></Button>}
            </div>
        </div>
    )
}

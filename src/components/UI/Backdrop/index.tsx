import React from 'react'
import styles from './Backdrop.module.sass'

type BackdropProps = {
    show: boolean
    onClose: () => void
}

export const Backdrop: React.FC<BackdropProps> = ({ show, onClose }): JSX.Element => {
    return <div className={`${styles.backdrop} ${show && styles.active}`} onClick={onClose}></div>
}

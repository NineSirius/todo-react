import React from 'react'
import styles from './Modal.module.sass'
import { Backdrop } from '../Backdrop'

type ModalProps = {
    show: boolean
    onClose: () => void
    children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ show, onClose, children }): JSX.Element => {
    return (
        <>
            <div className={`${styles.modal} ${show && styles.active}`}>{children}</div>
            <Backdrop show={show} onClose={onClose} />
        </>
    )
}

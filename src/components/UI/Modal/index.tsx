import React from 'react'
import styles from './Modal.module.sass'
import { Backdrop } from '../Backdrop'
import { Button } from '../Button'
import { MdClose } from 'react-icons/md'

type ModalProps = {
    show: boolean
    title: React.ReactNode
    onClose: () => void
    children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ show, title, onClose, children }): JSX.Element => {
    return (
        <>
            <div className={`${styles.modal} ${show && styles.active}`}>
                <div className={styles.modal_title}>
                    {title}{' '}
                    <Button variant="default" onClick={onClose} className={styles.closeBtn}>
                        <MdClose />
                    </Button>
                </div>
                <div className={styles.modal_content}>{children}</div>
            </div>
            <Backdrop show={show} onClose={onClose} />
        </>
    )
}

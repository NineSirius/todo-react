import React, { createContext, useContext, useState, ReactNode } from 'react'
import styles from './ModalProvider.module.sass'
import { Modal } from 'components/UI/Modal'
import { Button } from 'components/UI/Button'

type ModalState = {
    isOpen: boolean
    title?: string,
    content: React.ReactNode
}

type ModalContextType = {
    openModal: (content: React.ReactNode, title?: string) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        title: "",
        content: null,
    })

    const openModal = (content: React.ReactNode, title?: string) => {
        setModalState({
            isOpen: true,
            content,
            title: title ? title : ""
        })
    }

    const closeModal = () => {
        setModalState((prevState) => ({
            ...prevState,
            isOpen: false,
        }))

        setTimeout(() => {
            setModalState((prevState) => ({
                ...prevState,
                content: null
            }))
        }, 400)
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Modal
                show={modalState.isOpen}
                onClose={closeModal}
                title={<h4>{modalState.title}</h4>}
            >
                <div className={styles.modal_content}>
                    {modalState.content}
                </div>
            </Modal>
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}

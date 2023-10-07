import React, { createContext, useContext, useState, ReactNode } from 'react'
import styles from './ModalPrompt.module.sass'
import { Modal } from 'components/UI/Modal'
import { Button } from 'components/UI/Button'

type PromptState = {
    isOpen: boolean
    title: string
    text: string
    onConfirm?: () => void | undefined
}

type PromptContextType = {
    promptState: PromptState
    openPrompt: (title: string, text: string, onConfirm?: () => void) => void
    closePrompt: () => void
    confirmPrompt: () => void
}

const PromptContext = createContext<PromptContextType | undefined>(undefined)

export function PromptProvider({ children }: { children: ReactNode }) {
    const [promptState, setPromptState] = useState<PromptState>({
        isOpen: false,
        title: '',
        text: '',
        onConfirm: undefined,
    })

    const openPrompt = (title: string, text: string, onConfirm?: () => void) => {
        setPromptState({
            isOpen: true,
            title,
            text,
            onConfirm,
        })
    }

    const closePrompt = () => {
        setPromptState((prevState) => ({
            ...prevState,
            isOpen: false,
        }))
    }

    const confirmPrompt = () => {
        if (promptState.onConfirm) {
            promptState.onConfirm()
        }
        closePrompt()
    }

    return (
        <PromptContext.Provider value={{ promptState, openPrompt, closePrompt, confirmPrompt }}>
            {children}
            <Modal
                show={promptState.isOpen}
                onClose={closePrompt}
                title={<h4>{promptState.title}</h4>}
            >
                <div className={styles.promptModal_content}>
                    <p>{promptState.text}</p>

                    <div className={styles.promptModal_controls}>
                        <Button variant="error" onClick={confirmPrompt}>
                            Подтвердить
                        </Button>
                        <Button variant="default" onClick={closePrompt}>
                            Отмена
                        </Button>
                    </div>
                </div>
            </Modal>
        </PromptContext.Provider>
    )
}

export function usePrompt() {
    const context = useContext(PromptContext)
    if (!context) {
        throw new Error('usePrompt must be used within a ModalProvider')
    }
    return context
}

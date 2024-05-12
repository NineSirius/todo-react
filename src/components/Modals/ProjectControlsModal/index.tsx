import React, { useState } from 'react'
import styles from "./ProjectControlsModal.module.sass"
import { Button } from '@components/UI/Button'

type ProjectControlsModal = {
    type: "add" | "edit",
    onSubmit: (title: string) => void
    projectId: string
    title?: string
}

export const ProjectControlsModal: React.FC<ProjectControlsModal> = ({ type, onSubmit, projectId, title }) => {
    const [projectName, setProjectName] = useState<string>(title || "")

    return (
        <div className={styles.form}>
            <label>
                <span>Название проекта*</span>
                <input
                    type="text"
                    value={projectName}
                    maxLength={36}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                />
            </label>

            <Button onClick={() => {
                onSubmit(projectName)
                setProjectName("")
            }}>{type === "add" && "Создать" || type === "edit" && "Изменить"}</Button>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { ProjectT } from 'types/ProjectT'
import { TaskT } from 'types/TaskT'

export const ProjectPage = () => {
    const [projectInfo, setProjectInfo] = useState<ProjectT | null>(null)
    const [tasks, setTasks] = useState<TaskT[]>([])
    const { id } = useParams()

    useEffect(() => {
        const projects = localStorage.getItem('projects')
        if (projects) {
            const parsedProjects = JSON.parse(projects)
            const project = parsedProjects.find((item: ProjectT) => item.id === id)
            if (project) {
                setProjectInfo(project)
                setTasks(project.tasks)
            }
        }
    }, [id])

    const handleDragEnd = (result: any) => {
        if (!result.destination) return

        const reorderedTasks = Array.from(tasks)
        const [movedTask] = reorderedTasks.splice(result.source.index, 1)
        reorderedTasks.splice(result.destination.index, 0, movedTask)

        setTasks(reorderedTasks)
    }

    if (projectInfo) {
        return (
            <div className="container">
                <h2>{projectInfo.title}</h2>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {tasks.map((item, index) => (
                                    <Draggable key={item.id} index={index} draggableId={item.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {item.title}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        )
    } else {
        return <h2>Loading</h2>
    }
}

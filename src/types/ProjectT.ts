import { TaskColumnT } from './TaskT'

export type ProjectT = {
    title: string
    createdAt: Date | string
    tasks: TaskColumnT[]
    id: string
    bg: {
        color: string
    }
}

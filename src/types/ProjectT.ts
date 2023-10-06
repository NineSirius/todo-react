import { TaskColumnT } from './TaskColumnT'
import { TaskT } from './TaskT'

export type ProjectT = {
    title: string
    createdAt: Date | string
    tasks: TaskT[]
    columns: TaskColumnT[]
    id: string
    bg: {
        color: string
    }
}

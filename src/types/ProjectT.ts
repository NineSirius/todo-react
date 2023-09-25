import { TaskT } from './TaskT'

export type ProjectT = {
    title: string
    createdAt: Date | string
    tasks: TaskT[]
    id: string
}

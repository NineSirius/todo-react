export type TaskColumnT = {
    queue: TaskT[]
    development: TaskT[]
    done: TaskT[]
}

export type TaskT = {
    id: string
    title: string
    description: string | null
}

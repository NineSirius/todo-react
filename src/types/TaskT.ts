export type TaskT = {
    id: string
    title: string
    description: string
    column: {
        title: string
        id: string
    }
    position: number
    createdAt: string
    isArchived: boolean
    number: number
    isCompleted: boolean
}

export type TaskT = {
    id: any
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

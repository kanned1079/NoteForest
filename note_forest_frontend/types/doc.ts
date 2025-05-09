export type DocumentItem = {
    id: number,
    title: string,
    subtitle: string,
    category: string,
    content: string,
    show?: boolean,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date
}
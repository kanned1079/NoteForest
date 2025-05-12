export type DocumentItem = {
    id: string,
    title: string,
    subtitle: string,
    category: string,
    content: string,
    show?: boolean,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date
}

export type GetDocumentsData = {
    page: number,
    size: number,
    search?: string,
    documents?: DocumentItem[],
    total: number
}
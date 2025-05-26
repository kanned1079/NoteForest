export type DocumentItem = {
    id: string,
    title: string,
    subtitle: string,
    category: string,
    content: string,
    show?: boolean,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string,
}

export type GetDocumentsData = {
    page: number,
    size: number,
    search?: string,
    documents?: DocumentItem[],
    total: number
}
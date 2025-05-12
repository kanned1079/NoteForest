export type User = {
    id: string,
    username?: string | null,
    email: string,
    role: 'admin' | 'user',
    token?: '',
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date
}
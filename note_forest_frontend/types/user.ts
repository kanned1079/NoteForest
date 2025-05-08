export type User = {
    id: number,
    username?: string,
    email: string,
    role: 'admin' | 'user',
    token?: '',
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date
}
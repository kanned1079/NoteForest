// composables/useApiFetch.ts
export function useApiFetchRequest<T>(
    url: string,
    options: {
        auth?: boolean
        headers?: Record<string, string>
        [key: string]: any
    } = {}
) {
    const config = useRuntimeConfig()
    const token = useCookie('token') // 从 cookie 获取 JWT/token

    // 构造 headers
    const headers: Record<string, string> = {
        ...(options.headers || {})
    }

    if (options.auth && token.value) {
        headers.Authorization = `Bearer ${token.value}`
    }

    return useFetch<T>(url, {
        baseURL: config.public.apiBase as string,
        credentials: 'include',
        server: false,
        headers,
        ...options,
    })
}
export async function useCommonFetch<T>(
    url: string,
    options: {
        auth?: boolean
        headers?: Record<string, string>
        [key: string]: any
    } = {}
): Promise<{ data: T | null; error: any }> {
    const config = useRuntimeConfig()
    const token = useCookie('token')

    const headers: Record<string, string> = {
        ...(options.headers || {})
    }

    if (options.auth && token.value) {
        headers.Authorization = `Bearer ${token.value}`
    }

    // try {
    //     const data = await $fetch<T>(url, {
    //         baseURL: config.public.apiBase as string,
    //         credentials: 'include',
    //         headers,
    //         throw: false, // 不自动抛出 HTTP 错误
    //         ...options,
    //     })
    //
    //     return { data, error: null }
    //
    // } catch (error) {
    //     // 捕获底层网络、格式、CORS 等错误
    //     console.error('useCommonFetch error:', error)
    //     return { data: null, error }
    // }
    try {
        const data = await $fetch<T & { code?: number; message?: any }>(url, {
            baseURL: config.public.apiBase as string,
            credentials: 'include',
            headers,
            throw: false,
            ...options,
        })

        // 🔐 如果是未授权，执行登出或跳转等逻辑
        if ((data as any)?.code === 401) {
            console.warn('未授权，执行跳转')
            token.value = null
            // 你可以使用 navigateTo('/login') 或调用登出逻辑
            await navigateTo('/login')
            return { data: null, error: 'Unauthorized' }
        }

        return { data, error: null }

    } catch (error) {
        console.error('useCommonFetch error:', error)
        return { data: null, error }
    }
}
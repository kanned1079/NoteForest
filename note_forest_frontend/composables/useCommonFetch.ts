import useUserStore from '~/store/userStore'

export async function useCommonFetch<T>(
    url: string,
    options: {
        auth?: boolean
        headers?: Record<string, string>
        [key: string]: any
    } = {}
): Promise<{ data: T | null; error: string | null; code: number }> {
    const userStore = useUserStore()
    const config = useRuntimeConfig()
    const token = useCookie('token')
    const headers: Record<string, string> = {
        ...(options.headers || {})
    }

    if (options.auth && token.value) {
        headers.Authorization = `Bearer ${token.value}`
    }

    try {
        const raw = await $fetch<{
            code: number
            message: string | string[]
            data: T
        }>(url, {
            baseURL: config.public.apiBase as string,
            credentials: 'include',
            headers,
            throw: false,
            ...options
        })

        console.log('raw: ', raw)

        // 🔐 处理未授权
        if (raw.code === 401) {
            userStore.logout()
            return {code: 401, data: null, error: '未授权，请重新登录' }
        }

        // ❗处理业务失败
        if (raw.code !== 200) {
            const msg = Array.isArray(raw.message) ? raw.message.join(', ') : raw.message
            return {code: 500, data: null, error: msg || '请求失败' }
        }

        return {
            code: 200,
            data: raw.data,
            error: null
        }

    } catch (err) {
        console.error('Fetch error:', err)

        // 有些情况下 Nest 的异常没用统一格式返回
        if (err?.response?.status === 401 || err?.status === 401) {
            console.error('Token过期')
            userStore.logout()
            return {code: 401, data: null, error: '未授权，请重新登录' }
        }

        if (err?.response?.status === 400 || err?.status === 400) {
            console.error('数据格式不正确')
            userStore.logout()
            return {code: 400, data: null, error: '数据格式不正确' }
        }

        if (err?.response?.status === 404 || err?.status === 404) {
            console.error('数据不存在')
            userStore.logout()
            return {code: 404, data: null, error: '数据不存在' }
        }

        return {code: 500, data: null, error: '网络错误或服务器异常' }
    }
}
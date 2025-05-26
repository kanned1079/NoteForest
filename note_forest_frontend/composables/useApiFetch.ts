import useUserStore from '~/store/userStore'

export async function useApiFetchRequest<T>(
    url: string,
    options: {
        auth?: boolean
        headers?: Record<string, string>
        [key: string]: any
    } = {}
): Promise<{ data: T | null; error: string | null; code: number }> {
    const config = useRuntimeConfig()
    const token = useCookie('token')
    const userStore = useUserStore()
    // const { locale, t } = useI18n()

    const headers: Record<string, string> = {
        ...(options.headers || {}),
        'Access-Control-Allow-Origin': '*',
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
            baseURL: config.public.apiBase,
            credentials: 'include',
            // server: false,
            // throw: false,
            headers,
            ...options,
        })

        if (options.auth && raw.code === 401) {
            token.value = null
            userStore.logout()
            return {
                code: 401,
                data: null,
                error: '未授权，请重新登录',
            }
        }

        if (raw.code !== 200) {
            const msg = Array.isArray(raw.message) ? raw.message.join(', ') : raw.message
            return {
                code: raw.code,
                data: null,
                error: msg || '请求失败',
            }
        }

        return {
            code: 200,
            data: raw.data,
            error: null,
        }
    } catch (err: any) {
        // 可能是 CORS 或 fetch 网络异常
        if (options.auth && (err?.response?.status === 401 || err?.status === 401)) {
            token.value = null
            userStore.logout()
            return {
                code: 401,
                data: null,
                error:  '未授权，请重新登录',
            }
        }

        return {
            code: 500,
            data: null,
            error:  '网络错误或服务器异常',
        }
    }
}
import type {DocumentItem} from "~/types/doc";
// import useUserStore from "~/store/userStore";
import {useCommonFetch} from "~/composables/useCommonFetch";
// import type {User} from "~/types/user";
import type {UniversalApiResponse} from "~/types/res";
import {da} from "vuetify/locale";
import useUserStore from "~/store/userStore";
import type {User} from "~/types/user";

type FetchDocExtraField = {
    page?: number
    size?: number
    total: number
    search?:string
}

type AddDocResp = {
    code: number
    message?: string | null
}


export const commitNewDocument = async (doc: DocumentItem): Promise<{ code: number, err?: string }> => {
    const {code, data, error} = await useCommonFetch<AddDocResp>(`/api/v1/knowledge`, {
        method: 'POST',
        auth: true,
        body: {
            ...doc
        }
    })
    if (!error && code === 200 && data) {
        return {code: 200}
    } else {
        return {code: code, err: error}
    }
}

export const updateDocumentByUuid = async (id: string, doc: DocumentItem): Promise<{code: number, err?: string}> => {
    const {code, data, error} = await useCommonFetch<AddDocResp>(`/api/v1/knowledge/${id}`, {
        method: 'PATCH',
        auth: true,
        body: {
            ...doc
        }
    })
    if (!error && code === 200 && data) {
        return {code: 200}
    } else {
        return {code: code, err: error}
    }
}

export const deleteDocumentByUuid = async (id: string): Promise<{code: number, err?: string}> => {
    const {code, data, error} = await useCommonFetch<AddDocResp>(`/api/v1/knowledge/${id}`, {
        method: 'DELETE',
        auth: true,
    })
    if (!error && code === 200 && data) {
        return {code: 200}
    } else {
        return {code: code, err: error}
    }
}

export const fetchAllDocuments = async (
    page: number,
    size: number,
    search: string,
    as_list: boolean
): Promise<{
    code: number
    message?: string | null
    data: DocumentItem[] | null
    page?: number
    size?: number
    total?: number
}> => {
    const { data, error } = await useCommonFetch<{
        documents?: DocumentItem[]
        page?: number
        size?: number
        total?: number
        search?: string
    }>('/api/v1/knowledge', {
        method: 'GET',
        auth: false,
        params: as_list
            ? {
                page,
                size,
                search,
                list: true
            }
            : {
                page,
                size,
                search
            }
    })

    if (error) {
        return {
            code: 500,
            message: error,
            data: null
        }
    }

    return {
        code: 200,
        message: 'success',
        data: data?.documents ?? null,
        page: data?.page,
        size: data?.size,
        total: data?.total
    }
}

export const getDocumentByUuid = async (uuid: string): {
    code: number,
    data?: DocumentItem
} => {
    const {code, data, error} = await useCommonFetch<DocumentItem>(`/api/v1/knowledge/${uuid}`, {
        method: 'GET',
        auth: false,
    })
    if (!error && code === 200 && data) {
        return {
            code: 200,
            data: data
        }
    } else {
        return {code: code}
    }
}
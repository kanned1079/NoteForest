import type {DocumentItem} from "~/types/doc";
// import useUserStore from "~/store/userStore";
import {useCommonFetch} from "~/composables/useCommonFetch";
// import type {User} from "~/types/user";
import type {UniversalApiResponse} from "~/types/res";
import {da} from "vuetify/locale";

type FetchDocExtraField = {
    page?: number
    size?: number
    total: number
    search?:string
}


export const commitNewDocument = async (doc: DocumentItem): { code: number } => {
    const {data, error} = await useCommonFetch<{ data: UniversalApiResponse<any> }>('/api/v1/knowledge', {
        method: 'POST',
        auth: true,
        body: {
            ...doc
        }
    })
    console.log('-----', data)
    if (!error) {
        if (data.data) {
            let _data: UniversalApiResponse<any> = data?.data
            if (_data.code === 200) {
                console.log(_data)
            }
            return {code: _data.code}
        }
    } else {
        return {code: 500}
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
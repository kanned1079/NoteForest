import type {DocumentItem} from "~/types/doc";
// import useUserStore from "~/store/userStore";
import {useCommonFetch} from "~/composables/useCommonFetch";
// import type {User} from "~/types/user";
import type {UniversalApiResponse} from "~/types/res";

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
    console.log(data)
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

export const fetchAllDocuments = async (page: number, size: number, search: string, as_list: boolean): {
    code: number,
    data: DocumentItem[],
    page: number,
    size: number,
    total: number
} => {
    console.log('fetch doc')
    const {data, error} = await useCommonFetch<{ data: UniversalApiResponse<DocumentItem[], FetchDocExtraField> }>('/api/v1/knowledge', {
        method: 'GET',
        auth: false,
        params: as_list ? {
            page: page,
            size: size,
            search: search,
            list: true,
        } : {
            page: page,
            size: size,
            search: search,
        }
    })
    if (!error) {
        if (data.data) {
            let _data: UniversalApiResponse<DocumentItem[], FetchDocExtraField> = data?.data
            if (_data.code === 200) {
                return {
                    code: _data.code,
                    data: _data.data as DocumentItem[],
                    total: _data.total
                }
            } {
                return {
                    code: _data.code
                }
            }
        }
    } else {
        return {code: 500}
    }
}
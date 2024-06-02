import request from '~/global/request'

export default class Webquestion {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/webquestion',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/webquestion/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/webquestion',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/webquestion',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/webquestion/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/webquestion',
            params: params
        })

        if (res.items == null) {
            res.items = []
        }
        return res
    }

    static async count(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/webquestion/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/webquestion/${id}`
        })

        return res
    }

    static async init() {
        const res = await request({
            method: 'GET',
            url: `/api/webquestion/initdata`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/webquestion/sum?${params}`
        })

        return res
    }


}

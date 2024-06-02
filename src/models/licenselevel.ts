import request from '~/global/request'

export default class Licenselevel {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/licenselevel',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/licenselevel/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/licenselevel',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/licenselevel',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/licenselevel/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/licenselevel',
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
            url: '/api/licenselevel/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/licenselevel/${id}`
        })

        return res
    }

    static async init() {
        const res = await request({
            method: 'GET',
            url: `/api/licenselevel/initdata`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/licenselevel/sum?${params}`
        })

        return res
    }


    

}

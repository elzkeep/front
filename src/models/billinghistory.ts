import request from '~/global/request'

export default class Billinghistory {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/billinghistory',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/billinghistory/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/billinghistory',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/billinghistory',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/billinghistory/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/billinghistory',
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
            url: '/api/billinghistory/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/billinghistory/${id}`
        })

        return res
    }

    static async init() {
        const res = await request({
            method: 'GET',
            url: `/api/billinghistory/initdata`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/billinghistory/sum?${params}`
        })

        return res
    }



     static async deleteByBilling(billing) {
        let item = {
          billing
        }
        
        const res = await request({
            method: 'DELETE',
            url: '/api/billinghistory/bybilling',
            data: item
        })

        return res
    }
    

}

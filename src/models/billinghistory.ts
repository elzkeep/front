import request from '~/global/request'

export default class Billinghistory {
    static readonly type = { account: 1, giro: 2, cash: 3, card: 4, cms: 5, etc: 6} as const 
    static readonly types = ['', '이체', '지로', '현금', '카드', 'CMS', '기타']
        
    
    static getType(value: number) {
        return this.types[value]
    }
    
    
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

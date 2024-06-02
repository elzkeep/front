import request from '~/global/request'

export default class Billinglist {
    static readonly status = { wait: 1, complete: 2} as const 
    static readonly statuss = ['', '입금대기', '입금완료']
    static readonly giro = { wait: 1, complete: 2} as const 
    static readonly giros = ['', '미발행', '발행']
        
    
    static getStatus(value: number) {
        return this.statuss[value]
    }
    
    static getGiro(value: number) {
        return this.giros[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/billinglist',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/billinglist/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/billinglist',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/billinglist',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/billinglist/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/billinglist',
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
            url: '/api/billinglist/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/billinglist/${id}`
        })

        return res
    }

    static async init() {
        const res = await request({
            method: 'GET',
            url: `/api/billinglist/initdata`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/billinglist/sum?${params}`
        })

        return res
    }


}

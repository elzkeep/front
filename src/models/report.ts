import request from '~/global/request'

export default class Report {
    static readonly status = { newer: 1, ing: 2, check: 3, complete: 4} as const 
    static readonly statuss = ['', '신규', '점검중', '점검완료', '작성완료']
        
    
    static getStatus(value: number) {
        return this.statuss[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/report',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/report/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/report',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/report',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/report/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/report',
            params: params
        })

        if (res.items == null) {
            res.items = []
        }
        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/report',
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
            url: '/api/report/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/report/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/report/sum?${params}`
        })

        return res
    }


}

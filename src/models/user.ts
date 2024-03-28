import request from '~/global/request'

export default class User {
    static readonly level = { normal: 1, manager: 2, admin: 3, rootadmin: 4} as const 
    static readonly levels = ['', '일반', '팀장', '관리자', '전체관리자']
    static readonly status = { use: 1, notuse: 2} as const 
    static readonly statuss = ['', '사용', '사용안함']
        
    
    static getLevel(value: number) {
        return this.levels[value]
    }
    
    static getStatus(value: number) {
        return this.statuss[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/user',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/user/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/user',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/user',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/user/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/user',
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
            url: '/api/user/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/user/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/user/sum?${params}`
        })

        return res
    }


    

    

    

    

    

}

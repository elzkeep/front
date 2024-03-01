import request from '~/global/request'
/*


interface Statisticsyear {
    id: int
    duration: string
    total: int64
    totalprice: int64
    billdate: string
    
}
*/
export default class Statisticsyear {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/statisticsyear',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/statisticsyear/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/statisticsyear',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/statisticsyear',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/statisticsyear/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/statisticsyear',
            params: params
        })

        if (res.items == null) {
            res.items = []
        }
        return res
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/statisticsyear/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/statisticsyear/sum?${params}`
        })

        return res
    }


}

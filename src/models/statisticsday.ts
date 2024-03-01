import request from '~/global/request'
/*


interface Statisticsday {
    id: int
    month: string
    duration: string
    total: int64
    totalprice: int64
    billdate: string
    
}
*/
export default class Statisticsday {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/statisticsday',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/statisticsday/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/statisticsday',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/statisticsday',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/statisticsday/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/statisticsday',
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
            url: `/api/statisticsday/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/statisticsday/sum?${params}`
        })

        return res
    }


}

import request from '~/global/request'
/*


interface Statisticsmonth {
    id: int
    year: string
    duration: string
    total: int64
    totalprice: int64
    billdate: string
    
}
*/
export default class Statisticsmonth {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/statisticsmonth',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/statisticsmonth/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/statisticsmonth',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/statisticsmonth',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/statisticsmonth/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/statisticsmonth',
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
            url: `/api/statisticsmonth/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/statisticsmonth/sum?${params}`
        })

        return res
    }


}

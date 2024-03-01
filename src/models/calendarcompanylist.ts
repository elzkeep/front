import request from '~/global/request'
/*


interface Calendarcompanylist {
    id: int64
    company: int64
    month: string
    day: string
    status: int
    count: int64
    checkdate: string
    
}
*/
export default class Calendarcompanylist {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/calendarcompanylist',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/calendarcompanylist/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/calendarcompanylist',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/calendarcompanylist',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/calendarcompanylist/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/calendarcompanylist',
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
            url: `/api/calendarcompanylist/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/calendarcompanylist/sum?${params}`
        })

        return res
    }


}

import request from '~/global/request'
/*


interface Building {
    id: int
    name: string
    conpanyno: string
    ceo: string
    address: string
    addressetc: string
    status: int
    company: int64
    date: string
    
}
*/
export default class Building {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/building',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/building/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/building',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/building',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/building/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/building',
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
            url: `/api/building/${id}`
        })

        return res
    }        
}

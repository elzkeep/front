import request from '~/global/request'
/*


interface Licensecategory {
    id: int64
    name: string
    order: int
    date: string
    
}
*/
export default class Licensecategory {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/licensecategory',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/licensecategory/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/licensecategory',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/licensecategory',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/licensecategory/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/licensecategory',
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
            url: `/api/licensecategory/${id}`
        })

        return res
    }


}

import request from '~/global/request'

export default class Facility {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/facility',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/facility/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/facility',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/facility',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/facility/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/facility',
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
            url: '/api/facility',
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
            url: '/api/facility/count',
            params: params
        })
        
        return res.total
    }

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/facility/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/facility/sum?${params}`
        })

        return res
    }



     static async deleteByBuildingCategory(building ,category) {
        let item = {
          building ,category
        }
        
        const res = await request({
            method: 'DELETE',
            url: '/api/facility/bybuildingcategory',
            data: item
        })

        return res
    }
    

}

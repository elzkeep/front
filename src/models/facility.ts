import request from '~/global/request'
/*


interface Facility {
    id: int64
    category: int
    parent: int64
    value1: string
    value2: string
    value3: string
    value4: string
    value5: string
    value6: string
    value7: string
    value8: string
    value9: string
    value10: string
    value11: string
    value12: string
    value13: string
    value14: string
    value15: string
    value16: string
    value17: string
    value18: string
    value19: string
    value20: string
    value21: string
    value22: string
    value23: string
    value24: string
    value25: string
    content: string
    building: int64
    date: string
    
}
*/
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

    static async get(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/facility/${id}`
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

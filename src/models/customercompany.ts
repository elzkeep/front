import request from '~/global/request'
/*


interface Customercompany {
    company: int64
    id: int
    name: string
    companyno: string
    ceo: string
    address: string
    addressetc: string
    type: int
    status: int
    billingname: string
    billingtel: string
    billingemail: string
    date: string
    buildingcount: int64
    contractprice: int
    score: Double
    
}
*/
export default class Customercompany {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/customercompany',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/customercompany/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/customercompany',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/customercompany',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/customercompany/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/customercompany',
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
            url: `/api/customercompany/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/customercompany/sum?${params}`
        })

        return res
    }


}

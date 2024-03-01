import request from '~/global/request'
/*
enum type {
    direct = 1,
    outsourcing = 2
}


interface Customer {
    id: int
    type: customer.Type
    checkdate: int
    managername: string
    managertel: string
    manageremail: string
    contractstartdate: string
    contractenddate: string
    contractprice: int
    contractday: int
    billingdate: int
    billingname: string
    billingtel: string
    billingemail: string
    status: int
    user: int64
    company: int64
    building: int64
    date: string
    
}
*/
export default class Customer {
    static readonly type = { direct: 1, outsourcing: 2} as const 
    static readonly types = ['', '직영', '위탁관리']
        
    
    static getType(value: number) {
        return this.types[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/customer',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/customer/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/customer',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/customer',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/customer/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/customer',
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
            url: `/api/customer/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/customer/sum?${params}`
        })

        return res
    }


}

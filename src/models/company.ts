import request from '~/global/request'
/*
enum type {
    work = 1,
    building = 2
}


interface Company {
    id: int
    name: string
    companyno: string
    ceo: string
    address: string
    addressetc: string
    buildingname: string
    buildingcompanyno: string
    buildingceo: string
    buildingaddress: string
    buildingaddressetc: string
    type: company.Type
    checkdate: int
    managername: string
    managertel: string
    manageremail: string
    contractstartdate: string
    contractenddate: string
    contractprice: int
    billingdate: int
    billingname: string
    billingtel: string
    billingemail: string
    status: int
    companygroup: int64
    date: string
    
}
*/
export default class Company {
    static readonly type = { work: 1, building: 2} as const 
    static readonly types = ['', '점검', '건물']
        
    
    static getType(value: number) {
        return this.types[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/company',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/company/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/company',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/company',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/company/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/company',
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
            url: `/api/company/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/company/sum?${params}`
        })

        return res
    }


}

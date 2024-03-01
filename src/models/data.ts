import request from '~/global/request'
/*
enum type {
    single = 1,
    multi = 2
}


interface Data {
    id: int
    topcategory: int
    title: string
    type: data.Type
    category: int
    order: int
    report: int64
    company: int64
    date: string
    
}
*/
export default class Data {
    static readonly type = { single: 1, multi: 2} as const 
    static readonly types = ['', 'Single', 'Multi']
        
    
    static getType(value: number) {
        return this.types[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/data',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/data/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/data',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/data',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/data/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/data',
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
            url: `/api/data/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/data/sum?${params}`
        })

        return res
    }



     static async deleteByReportTopcategory(report ,topcategory) {
        let item = {
          report ,topcategory
        }
        
        const res = await request({
            method: 'DELETE',
            url: '/api/data/byreporttopcategory',
            data: item
        })

        return res
    }
    

}

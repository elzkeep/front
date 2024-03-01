import request from '~/global/request'
/*
enum type {
    text = 1,
    select = 2,
    status = 3
}
enum status {
    good = 1,
    warning = 2,
    danger = 3,
    notuse = 4
}


interface Item {
    id: int64
    title: string
    type: item.Type
    value1: int
    value2: int
    value3: int
    value4: int
    value5: int
    value6: int
    value7: int
    value8: int
    value: int
    content: string
    unit: string
    status: item.Status
    reason: int
    reasontext: string
    action: int
    actiontext: string
    image: string
    order: int
    topcategory: int
    data: int64
    report: int64
    date: string
    
}
*/
export default class Item {
    static readonly type = { text: 1, select: 2, status: 3} as const 
    static readonly types = ['', 'Text', 'Select', 'Status']
    static readonly status = { good: 1, warning: 2, danger: 3, notuse: 4} as const 
    static readonly statuss = ['', '적합', '부적합', '요주의', '해당없음']
        
    
    static getType(value: number) {
        return this.types[value]
    }
    
    static getStatus(value: number) {
        return this.statuss[value]
    }
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/item',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/item/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/item',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/item',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/item/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/item',
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
            url: `/api/item/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/item/sum?${params}`
        })

        return res
    }



     static async deleteByReportTopcategory(report ,topcategory) {
        let item = {
          report ,topcategory
        }
        
        const res = await request({
            method: 'DELETE',
            url: '/api/item/byreporttopcategory',
            data: item
        })

        return res
    }
    

}

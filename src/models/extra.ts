import request from '~/global/request'

export default class Extra {
    static async print(params: any) {
        const ids = params.join(',')

        console.log("ids", ids)
        const res = await request({
            method: 'GET',
            url: `/api/billing/print/${ids}`
        })

        return res
    }

    static async external(type: number, params: any) {
        const filenames = params.join(',')
        
        const res = await request({
            method: 'GET',
            url: `/api/external?type=${type}&filenames=${filenames}`
        })

        return res
    }

    static async externaluser(filename: string) {
        const res = await request({
            method: 'GET',
            url: `/api/external/user/${filename}`
        })

        return res
    }

    static async company(filename: string) {
        const res = await request({
            method: 'GET',
            url: `/api/company/upload/${filename}`
        })

        return res
    }

    static async usersearch(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/user/search',
            params: params
        })

        if (res.items == null) {
            res.items = []
        }
        return res
    }

    static async makebill(month: number, items: any) {
        let data = {
            ids: items.join(','),
            month: month
        }
        
        const res = await request({
            method: 'POST',
            url: '/api/billing/make',
            data: data
        })

        return res
    }

    static async companyupload(filename: string) {
        let data = {
            filename: filename            
        }
        
        const res = await request({
            method: 'POST',
            url: '/api/company/upload',
            data: data
        })

        return res
    }

    static async customerstatus(id: number) {        
        const res = await request({
            method: 'GET',
            url: `/api/customer/status/${id}`
        })

        return res
    }
}

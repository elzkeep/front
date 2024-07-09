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

    static async externalall(category: number, filename: string) {
        const res = await request({
            method: 'GET',
            url: `/api/external/all/${category}?filename=${filename}`
        })

        return res
    }

    static async externalgiro(filename: any) {
        const res = await request({
            method: 'POST',
            url: `/api/external/giro`,
            data: {
                filename: filename
            }
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

    static async user(filename: string) {
        const res = await request({
            method: 'GET',
            url: `/api/user/upload/${filename}`
        })

        return res
    }

    static async customer(filename: string) {
        const res = await request({
            method: 'GET',
            url: `/api/customer/upload/${filename}`
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

    static async makebill(durationtype: number, base: number, year: number, month: number, durationmonth: any, items: any, price: any, vat: any, remark: any) {
        let data = {
            durationtype: durationtype,
            base: base,
            ids: items.join(','),
            price: price.join(','),
            vat: vat.join(','),
            remark: remark.join(','),
            month: month,
            durationmonth: durationmonth,
            year: year
        }

        console.log(data)

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

    static async maxnumber(id: number) {
        const res = await request({
            method: 'GET',
            url: `/api/customer/maxnumber/${id}`
        })

        return res
    }

    static async deposit(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/billinghistory/deposit',
            data: item
        })

        return res
    }

    static async depositdelete(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/billinghistory/depositdelete',
            data: item
        })

        return res
    }

    static async score(id: number) {
        const item = {
            id: id
        }
        const res = await request({
            method: 'POST',
            url: `/api/building/score`,
            data: item
        })

        return res
    }

    static async dataitemProcess(item: any) {
        const res = await request({
            method: 'POST',
            url: `/api/dataitem/process`,
            data: item
        })

        return res
    }

    static async dashboard() {
        const res = await request({
            method: 'GET',
            url: '/api/dashboard/initdata'
        })

        return res
    }


}

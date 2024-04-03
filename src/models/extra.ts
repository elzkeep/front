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

    static async company(filename: string) {
        const res = await request({
            method: 'GET',
            url: `/api/company/upload/${filename}`
        })

        return res
    }
}

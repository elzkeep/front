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
}

import request from '~/global/request'
/*


interface Userlist {
    id: int64
    loginid: string
    passwd: string
    name: string
    email: string
    tel: string
    address: string
    addressetc: string
    joindate: string
    careeryear: int
    careermonth: int
    level: int
    score: Double
    status: int
    company: int64
    department: int64
    date: string
    totalscore: Double
    
}
*/
export default class Userlist {
        
    
    
    static async insert(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/userlist',
            data: item
        })

        return res
    }

    static async insertbatch(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/userlist/batch',
            data: item
        })

        return res
    }

    static async update(item: any) {
        const res = await request({
            method: 'PUT',
            url: '/api/userlist',
            data: item
        })

        return res
    }

    static async remove(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/userlist',
            data: item
        })

        return res
    }

    static async removebatch(item: any) {
        const res = await request({
            method: 'DELETE',
            url: '/api/userlist/batch',
            data: item
        })

        return res
    }

    static async find(params: any) {
        const res = await request({
            method: 'GET',
            url: '/api/userlist',
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
            url: `/api/userlist/${id}`
        })

        return res
    }

    static async sum(params: string) {
        const res = await request({
            method: 'GET',
            url: `/api/userlist/sum?${params}`
        })

        return res
    }


}

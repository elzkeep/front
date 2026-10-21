import request from '~/global/request'

export default class Login {
    // 비밀번호가 URL·접근 로그에 남지 않게 POST JSON 으로 보낸다 (서버는 GET /api/jwt 를 막음)
    static async login(item: any) {
        const res = await request({
            method: 'POST',
            url: '/api/jwt',
            data: item
        })

        return res
    }
}

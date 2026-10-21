import request from '~/global/request'

// 회원가입 전용 공개 API (back/router/signup.go) — 생성 모델이 아니라 수기 파일. index.ts 에 넣지 않고 직접 import 한다
export default class Signup {
    // 이미 쓰이는 값인지 (true = 사용 중). except 는 수정 중인 사용자 id (자기 자신 제외)
    static async check(params: { loginid?: string, email?: string, companyno?: string, except?: number }) {
        const res = await request({
            method: 'POST',
            url: '/api/signup/check',
            data: params
        })

        return res
    }

    // 점검업체 + 그 업체 관리자 계정
    static async company(company: any, user: any, licenses: any[] = []) {
        const res = await request({
            method: 'POST',
            url: '/api/signup/company',
            data: { company, user, licenses }
        })

        return res
    }
}

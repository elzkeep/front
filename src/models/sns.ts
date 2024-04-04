import request from '~/global/request'

export default class Sns {
  static async mail(item: any) {
    const res = await request({
      method: 'POST',
      url: '/api/mail/index',
      data: item,
    })

    return res
  }

  static async sms(item: any) {
    const res = await request({
      method: 'POST',
      url: '/api/sms/index',
      data: item,
    })

    return res
  }
}

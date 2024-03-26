import request from "~/global/request";

export default class Uploadfile {
  static async insert(item: any) {
    const res = await request({
      headers: { "Content-Type": "multipart/form-data" },
      method: "POST",
      url: "/api/upload/index",
      data: item,
    });

    return res;
  }
}

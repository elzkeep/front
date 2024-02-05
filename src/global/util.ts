import { getCurrentInstance } from "vue"
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

import moment from 'moment'
import axios from 'axios'

export default class util {
    static login(store: any, res: any) {
        store.commit('setLogin', {token: res.token, user: res.user})
    }

    static isNull(value: string) {
        if (value == null || value == undefined || value == '') {
            return true
        } else {
            return false
        }
    }

    static getExt(value: string) {
        return value.split('.').pop()
    }

    static forceUpdate() {
        const instance = getCurrentInstance()
        instance?.proxy?.$forceUpdate()
    }

    static money(num: number) {
        num = this.getInt(num)
        var regexp = /\B(?=(\d{3})+(?!\d))/g
        return num.toString().replace(regexp, ',')
    }

    static moneyfloat(num: any) {
        num = parseFloat(num)
        num = Math.floor(num * 100) / 100
        var regexp = /\B(?=(\d{3})+(?!\d))/g
        return num.toString().replace(regexp, ',')
    }

    static moneyempty(num: number) {
        num = this.getInt(num)

        if (num == 0) {
            return ''
        }
        
        var regexp = /\B(?=(\d{3})+(?!\d))/g
        return num.toString().replace(regexp, ',')
    }

    static makeDate(year: number, month: number, day: number) {
        return this.pad(year, 4) + '-' + this.pad(month, 2) + '-' + this.pad(day, 2); 
    }

    static area(num: number) {
        num = Math.floor(num * 1000) / 1000
        var regexp = /\B(?=(\d{3})+(?!\d))/g
        return num.toString().replace(regexp, ',')
    }

    static clone(obj: any) {
        return JSON.parse(JSON.stringify(obj))
    }

    static replaceAll(str: string, searchStr: string, replaceStr: string) {
        return str.split(searchStr).join(replaceStr);
    }

    static nl2br(str: string) {
        if (this.isNull(str)) {
            return ''
        }
        return this.replaceAll(str, '\n', '<BR/>')
    }

    static getDate(d: any) {
        if (this.isNull(d) || d == '') {
            return ''
        }

        d.setTime(d.getTime() + 9 * 60 * 60 * 1000);
        return moment(d).format('YYYY-MM-DD')
    }

    static getYear(d: string) {
        if (this.isNull(d)) {
            return ''
        }

        let temp = d.split('-')
        return temp[0]
    }

    static alert(str: string) {
        ElMessageBox.alert(str, '', {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: '닫기'            
        })
    }
    static info(str: string) {
        //ElMessage({message: str, duration: 1000})
    }

    static error(str: string) {
        ElMessage.error({message: str, duration: 1000})
    }

    static confirm(title: string, successFunc: any, cancelFunc: any) {
        ElMessageBox.confirm(
            title,
            '',
            {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                type: 'warning',
            }
        ).then(() => {
            if (successFunc != undefined && successFunc != null) {
                successFunc()
            }
        }).catch(() => {
            if (cancelFunc != undefined && cancelFunc != null) {
                cancelFunc()
            }
        })
    }

    static messagebox(title: string, content: string, func: any) {
        ElMessageBox.alert(content, title, {            
            confirmButtonText: '확인',
            callback: (action: Action) => {
                if (func != undefined && func != null) {
                    func()
                }
            },
        })
    }

    static getInt(value: any) {
        if (value == undefined || value == null) {
            return 0
        }

        if (typeof value == 'string') {
            value = value.replace(/,/g, '')
        }

        /*
        if (typeof value == 'number') {
            return value
        }
        */

        const ret = parseInt(value)
        if (isNaN(ret)) {
            return 0
        }

        return ret
    }

    static getFloat(value: any) {
        if (value == undefined || value == null) {
            return 0
        }

        if (typeof value == 'string') {
            value = value.replace(/,/g, '')
        }

        /*
        if (typeof value == 'number') {
            return value
        }
        */
        
        const ret = parseFloat(value)
        if (isNaN(ret)) {
            return 0
        }

        return ret
    }

    static fixed(value: number, size: number) {
        let mul = parseInt(Math.pow(10, size))
        let num = Math.floor(value * mul) / mul
        
        return num
    }

    _loading: any = null
    
    static loading(value: boolean) {
        if (value == true) {
            this._loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            })
        } else {
            this._loading.close()
        }
    }

    static pad(value: any, width: number) {
        let str = '' + value;
        return str.length >= width ? str:new Array(width-str.length+1).join('0')+str;
    }

    static download(store: any, url: string, filename: string) {
        axios.get(import.meta.env.VITE_REPORT_URL + url, {
            responseType: 'blob',
            headers: {
                Authorization: 'Bearer ' + store.state.token
            }
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename);
            document.body.appendChild(link)
            link.click()
        }).catch(exception => {
            alert("파일 다운로드 실패");
        });        
    }

    static convertDate(value: any) {
        if (this.isNull(value) || value == '') {
            return ''
        }        

        if (typeof value == 'string' || typeof value == 'number') {
            let d = new Date(value)
            return util.getDate(d)
        }

        if (!this.isNull(value) && value != 0) {
            return util.getDate(value)
        }
        
        return ''
    }

    static convertDBDate(value: any) {
        if (this.isNull(value) || value == '') {
            return '1000-01-01'
        }        

        if (typeof value == 'string' || typeof value == 'number') {
            let d = new Date(value)
            return util.getDate(d)
        }

        if (!this.isNull(value) && value != 0) {
            return util.getDate(value)
        }

        return '1000-01-01'
    }

    static viewDate(value: string) {
        if (this.isNull(value) || value == '' || value == '0000-00-00' || value == '1000-01-01') {
            return ''
        }

        let temp = value.split('-')

        return `${temp[0]}년 ${temp[1]}월 ${temp[2]}일`
    }

    static getImagePath(filename: string, dir: string) {
        if (dir != undefined && dir != '') {
            filename = `${dir}/${filename}`
        }
        
        return import.meta.env.VITE_REPORT_URL + '/webdata/' + filename
    }

    static getCurrentDate() {
        let d = new Date()  
        return this.makeDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
    }
}

import Vue from 'vue'
import store from '../store'
import dateFormat from 'dateformat'

Vue.mixin({
  computed: {
    query() {
      const q = {
        query: {
          page: 1,
          ...this.filter,
        },
      }
      delete q.query.offset
      return q
    },
  },
  methods: {
    commonGet(url, payload) {
      return this.request('GET', `${VITE_DEFAULT_API_URL}${url}`, payload)
    },
    commonPost(url, payload) {
      return this.request('POST', `${VITE_DEFAULT_API_URL}${url}`, payload)
    },
    commonPut(url, payload) {
      return this.request('PUT', `${VITE_DEFAULT_API_URL}${url}`, payload)
    },
    commonDelete(url, payload) {
      return this.request('DELETE', `${VITE_DEFAULT_API_URL}${url}`, payload)
    },
    get(url, payload) {
      return this.request('GET', `${VITE_USER_API_URL}${url}`, payload)
    },
    post(url, payload) {
      return this.request('POST', `${VITE_USER_API_URL}${url}`, payload)
    },
    put(url, payload) {
      return this.request('PUT', `${VITE_USER_API_URL}${url}`, payload)
    },
    delete(url, payload) {
      return this.request('DELETE', `${VITE_USER_API_URL}${url}`, payload)
    },
    request(method, url, payload) {
      // GET 일 경우 payload 를 queryParameter
      if (['GET', 'DELETE'].includes(method) && payload) {
        const param = new URLSearchParams()
        for (const key in payload) {
          if (payload[key] instanceof Array) {
            for (let i = 0; i < payload[key].length; i++) {
              param.append(key, payload[key][i])
            }
          } else {
            param.append(key, payload[key])
          }
        }
        url += (url.includes('?') ? '&' : '?') + param.toString()
      }

      return new Promise((resolve, reject) => {
        let _axios = this.$http
        const config = {
          responseType: 'json',
          method,
          url,
          data: payload,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        }

        if (store.state.user.accessToken) {
          config.headers.Authorization = 'Bearer ' + store.state.user.accessToken
        }

        _axios(config)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => reject(error))
        _axios = undefined
      })
    },
    isOk(response) {
      return !response?.response?.data?.error
    },
    getHTTPErrorStatus(response) {
      return response?.response?.data?.error?.code
    },
    getMessage(response) {
      return response?.response?.data?.error?.message || '알 수 없는 오류가 발생했습니다.\n새로고침 해주세요'
    },
    alert({ title = '빌딩 플러스', message = '오류가 발생했습니다', theme = 'none' }) {
      return new Promise((resolve) => {
        store.commit('addModal', {
          title,
          message,
          actionCode: 'ALERT',
          theme,
        })
        this.$root.$on('alert', () => {
          resolve()
          this.$root.$off('alert')
        })
      })
    },
    alertMain({ title = '빌딩 플러스', message = '정산 자동 배부 배치 중 입니다. 잠시 후 다시 시도해주세요' }) {
      store.commit('addModal', {
        title,
        message,
        actionCode: 'DISTRIBUTION_BATCH',
      })
    },
    confirm({
      title = '빌딩 플러스',
      message = '승인하시겠습니까?',
      confirmName = '확인',
      cancelName = '취소',
      theme = 'none',
    }) {
      return new Promise((resolve) => {
        store.commit('addModal', {
          theme,
          title,
          message,
          confirmName,
          cancelName,
          actionCode: 'CONFIRM',
        })
        this.$root.$on('confirm', (bool) => {
          resolve(bool)
          this.$root.$off('confirm')
        })
      })
    },
    alertLogin({ title = '빌딩 플러스', message = '다시 로그인 해 주세요' }) {
      store.commit('addModal', {
        title,
        message,
        actionCode: 'LOGIN',
      })
    },
    async displayMessage(response) {
      let isToken = false
      let message = this.getMessage(response)
      let title = response?.response?.data?.error?.title || '빌딩 플러스'

	    if( message === 'Invalid access token' ) {
				isToken = true
		    title = '접속 계정 토큰 만료 안내'
		    message = `
		    접속 계정의 토큰이 만료되었습니다.
		    확인 버튼을 누르시면 자동으로 갱신처리됩니다.
		    `
	    }

      if (message) {
        await this.alert({ title, message, theme: 'error' })
	      if( isToken === true )
		      await this.$store.dispatch('user/refresh')
      }
    },
    responseSuccess(response) {
      store.commit('decreaseRequestCount')
      return response
    },
    mapFilter(query) {
      let filter = {
        ...query,
      }
      if (query?.page) {
        const page = query.page || 1
        const limit = query.limit || 50
        const offset = (page - 1) * limit
        filter = {
          ...query,
          offset,
          limit,
        }
        delete filter.page
      }
      return this.deepCopy(filter)
    },
    initDate: (day) => {
      if (day <= 0) {
        return [null, null]
      }
      const dateFrom = new Date(new Date().setHours(0, 0, 0, 0))
      const dateTo = new Date(new Date().setHours(0, 0, 0, 0))
      dateTo.setDate(dateTo.getDate() + day - 1)
      return [dateFrom.toISOString(), dateTo.toISOString()]
    },
    changeObjectToQueryString(obj) {
      const params = new URLSearchParams()
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          params.append(key, obj[key])
        }
      }
      return params.toString()
    },
    convertUTCtoLocalISOString(utcDate) {
      // 로컬 타임존 오프셋을 가져옴
      const localTimezoneOffsetMinutes = utcDate.getTimezoneOffset()

      // 로컬 타임존 오프셋을 문자열로 변환
      const offsetHours = Math.abs(Math.floor(localTimezoneOffsetMinutes / 60))
        .toString()
        .padStart(2, '0')
      const offsetMinutes = (Math.abs(localTimezoneOffsetMinutes) % 60).toString().padStart(2, '0')
      const offsetString = (localTimezoneOffsetMinutes >= 0 ? '-' : '+') + offsetHours + ':' + offsetMinutes

      // 현재 시간에 로컬 타임존 오프셋을 적용하여 ISO 문자열을 생성
      const timezoneOffsetMillis = localTimezoneOffsetMinutes * 60 * 1000
      const localTimeWithOffset = new Date(utcDate - timezoneOffsetMillis)
      const isoStringWithOffset = localTimeWithOffset.toISOString().slice(0, -1) + offsetString
      return isoStringWithOffset
    },
    formatHHMM(ISODateString) {
      if (ISODateString) {
        return dateFormat(new Date(ISODateString), 'HH:MM')
      }
      return ''
    },
    formatISODate(ISODateString, defaultFormat = 'yyyy-mm-dd HH:MM:ss') {
      if (ISODateString) {
        return dateFormat(new Date(ISODateString), defaultFormat)
      }
      return '-'
    },
    formatDateKo(ISODateString) {
      if (ISODateString) {
        return dateFormat(new Date(ISODateString), 'yyyy-mm-dd(ddd)')
      }
      return ''
    },
    formatYMD(ISODateString, defaultReturn = '') {
      if (ISODateString) {
        return dateFormat(new Date(ISODateString), 'yyyy-mm-dd')
      }
      return defaultReturn
    },
    formatYYYY(ISODateString) {
      if (ISODateString) {
        return dateFormat(new Date(ISODateString), 'yyyy')
      }
      return ''
    },
    formatMM(ISODateString) {
      if (ISODateString) {
        return dateFormat(new Date(ISODateString), 'mm')
      }
      return ''
    },
    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
      )
    },
    _actionCodeExcute(response) {
      if (!this.isOk(response)) {
        const action = response?.response?.data?.error
        switch (action.actionCode) {
          // case 'ALERT':
          //   this.alert(action)
          //   break
          // case 'LOGIN':
          //   this.alertLogin(action)
          //   break
          // case 'MAINTENANCE':
          //   this.alert(action)
          //   break

          case 'DISTRIBUTION_BATCH':
            this.alertMain(action)
            break
          default:
            break
        }
      }
    },
    async responseError(err) {
      store.commit('decreaseRequestCount')
      await this._actionCodeExcute(err)
      return Promise.reject(err)
    },
    formatWithLineBreaks(description) {
      // Replace new line characters with <br> for HTML rendering
      return description.replace(/\n/g, '<br>');
    }
  },
})

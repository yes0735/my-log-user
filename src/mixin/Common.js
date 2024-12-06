import aws from 'aws-sdk'
import Excel from 'exceljs'
import md5 from 'md5'
import dayjs from 'dayjs'
import streamSaver from 'streamsaver'
import Vue from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const {
  VITE_APP_BUCKET_REGION,
  VITE_APP_IDENTITY_POOL_ID,
  VITE_APP_S3_UPLOAD_BUCKET,
  VITE_APP_MODE,
  VITE_APP_S3_STATIC_URL,
  VITE_APP_S3_PRIVATE_UPLOAD_BUCKET,
} = import.meta.env

Vue.mixin({
  data() {
    return {
      debounceTimer: null,
    }
  },
  methods: {
    resizeWindow () {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--dvh', `${vh}px`)
      this.$store.commit('screenRecalculation')
    },
    log(e, name = '>>>') {
      console.log(name, this.JSONPrettyPrint(e))
      return e
    },
    /**
     * 숫자 3자리마다 쉼표찍어 반환
     *
     * @param val Number 숫자
     * @return String
     */
    numberFormat(val) {
      return this.getFormattedNumber(val)
    },
    /**
     * 숫자 3자리마다 쉼표찍어 반환
     * 소수점도 표기 (생략 안함)
     * @param val Number 숫자
     * @param decimal Number 소수점 자리수
     * @return String
     */
    formatNumberWithDecimal(val, decimal = 4) {
      if (val === null || val === undefined) {
        return '-'
      }
      const value = val.toString().split('.')
      const decimalValue = value[1] ? value[1].slice(0, decimal) : ''
      const formattedInteger = parseInt(value[0]).toLocaleString('ko-KR')
      const formattedDecimal = decimalValue.padEnd(decimal, '0')
      return `${formattedInteger}.${formattedDecimal}`
    },
    formatBytes(bytes) {
      if (bytes < 1024) {
        return bytes + ' Byte'
      } else if (bytes < 1048576) {
        const kilobytes = (bytes / 1024).toFixed(2)
        return kilobytes + ' KB'
      } else if (bytes < 1073741824) {
        const megabytes = (bytes / 1048576).toFixed(2)
        return megabytes + ' MB'
      } else {
        const gigabytes = (bytes / 1073741824).toFixed(2)
        return gigabytes + ' GB'
      }
    },
    formatNullToDash(val) {
      return val === null || val === undefined || val === '' ? '-' : val
    },
    getFormattedNumber(val) {
      const num = Number(val)
      if (!isNaN(num)) {
        return num.toLocaleString('ko-KR')
      }
      return '0'
    },
    getFormattedPhoneNumber(val) {
      return val.replace(/(\d{3})([\d*]{3,4})([\d*]{4})/, '$1-$2-$3')
    },
    getFormatResidentNumber(data) {
      // 숫자만 추출하여 형식에 맞게 "-" 문자를 추가
      return data.replace(/\D/g, '').replace(/(\d{6})(\d{7})/, '$1-$2')
    },
    getFormattedBusinessNumber(val) {
      // 입력 = 1234567890
      // 출력 = 123-45-67890
      const data = val || 0
      const stringOnly = data.toString()
      return stringOnly.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
    },
    JSONPrettyPrint(v) {
      return JSON.stringify(v, null, 2)
    },
    cleanData(obj) {
      const newObj = Array.isArray(obj) ? [] : {} // 객체 또는 배열에 따라 초기화

      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          const value = obj[prop]

          // 값이 객체 또는 배열인 경우 재귀 호출
          if (typeof value === 'object' && value !== null) {
            newObj[prop] = this.cleanData(value)
          } else if (value || (!value && value === 0)) {
            newObj[prop] = value // 빈 값이 아닌 경우 추가
          }
        }
      }

      return newObj
    },
    deepCopy(obj) {
      // 객체 deepCopy
      return JSON.parse(JSON.stringify(obj))
    },
    isSubsetOf(base, sample) {
      // sample 객체가 base에 완전 포함되는 객체인지 여부 체크
      return sample.every((number) => base.includes(number))
    },
    changeObjectToOption(obj = {}) {
      return Object.entries(obj).map(([key, value]) => {
        const x = {}
        x.value = key
        x.text = value
        return x
      })
    },
    isMoreThanMax(value, max) {
      return max !== null && value > max
    },
    isLessThanMin(value, min) {
      return min !== null && value < min
    },
    isNumberInteger(value) {
      // 숫자가 정수인지 여부 체크
      return Number.isInteger(parseFloat(value))
    },
    changeToMinimum(_value, min) {
      if (typeof _value === 'object' || _value == '') {
        return null
      }
      if (isNaN(_value)) {
        return 0
      }
      if (this.isLessThanMin(_value, min)) {
        return parseFloat(min)
      }
      return parseFloat(_value)
    },
    changeToMaximum(_value, max) {
      if (typeof _value === 'object' || _value == '') {
        return null
      }
      if (isNaN(_value)) {
        return 0
      }
      if (this.isMoreThanMax(_value, max)) {
        return parseFloat(max)
      }
      return parseFloat(_value)
    },
    // FIXME: 안씀. 제거예정
    getNumberLimitedDecimal(_value, limit = 0) {
      // 소수점 자릿 수 지정시 해당 값 까지 값을 가져옴 (ex. limit이 2일 경우 소수점 2자리까지)
      if (isNaN(_value) || typeof _value === 'object') {
        return null
      }
      return Math.floor(parseFloat(_value) * Math.pow(10, limit)) / Math.pow(10, limit)
    },
    notNumberBlockInputEvent(event) {
      // number type input에서 e, E, +, - 입력 방지
      if (['e', 'E', '+', '-'].includes(event.key)) {
        event.preventDefault()
      }
    },
    isEmptyObject(param) {
      return Object.keys(param).length === 0 && param.constructor === Object
    },
    getUniqueItems(items) {
      // 배열 내 객체 중복 제거
      const obj = items.map(JSON.stringify)
      return Array.from(new Set(obj)).map(JSON.parse)
    },
    getIndexNo(totalCount, index, limit, page) {
      return totalCount - (page - 1) * limit - index
    },
    getTodayDate(date = new Date()) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    getHTMLSplitDateTime(datetime) {
      if (!datetime) {
        return '-'
      }
      const [date, time] = this.formatISODate(datetime).split(' ')
      return `${date}<br />${time}`
    },
    formatDatetime(datetime) {
      if (!datetime) {
        return this.formatNullToDash(datetime)
      }
      return this.formatISODate(datetime)
    },
    replaceDataSpace(inputString, type = 'replace') {
      const str = inputString ?? ''
      if (type === 'remove') {
        return this.removeSpaces(str)
      }
      return this.replaceMultipleSpaces(str)
    },
    removeSpaces(inputString) {
      return inputString.replace(/\s/g, '')
    },
    replaceMultipleSpaces(inputString) {
      return inputString.replace(/ {2,}/g, ' ')
    },
    debounce(fn, wait) {
      return (...args) => {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer) // clear any pre-existing timer
        }
        const context = this // get the current context
        this.debounceTimer = setTimeout(() => {
          fn.apply(context, args) // call the function if time expires
        }, wait)
      }
    },
    throttle(fn, wait) {
      let throttled = false
      return function (...args) {
        if (!throttled) {
          fn.apply(this, args)
          throttled = true
          setTimeout(() => {
            throttled = false
          }, wait)
        }
      }
    },
    getCookie(name) {
      const matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)')
      )
      return matches ? decodeURIComponent(matches[1]) : undefined
    },
    setCookie(name, value, options = {}) {
      options = {
        path: '/',
        // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
        ...options,
      }

      if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString()
      }

      let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

      for (const optionKey in options) {
        updatedCookie += '; ' + optionKey
        const optionValue = options[optionKey]
        if (optionValue !== true) {
          updatedCookie += '=' + optionValue
        }
      }

      document.cookie = updatedCookie
    },
    deleteCookie(name) {
      this.setCookie(name, '', {
        'max-age': -1,
      })
    },
    /**
     * 엑셀 파일 읽어오기
     *
     * 급하게 새로 짯는데 성능 테스트는 안해봣습니다.
     * 누가 10만 row 이상 엑셀 읽기 테스트 해주실분? (성능이야 사용자 컴퓨터 성능에 달렸겠지만...)
     *
     * @param data input type=file e.target.files[0]
     * (인풋태그 file을 전달하면 Array of Object 로 밷음)
     * @param removeTopRows 상단에서 삭제할 row 수 설정(Number)
     * (createExcel 함수에서 titleHeader를 사용할 경우 3으로 설정해야함)
     */
    async readFromExcel(data, removeTopRows = 0) {
      const workbook = new Excel.Workbook()
      await workbook.xlsx.load(data)

      const worksheet = workbook.getWorksheet(1)

      if (!!removeTopRows) {
        worksheet.spliceRows(0, Number(removeTopRows))
      }
      const headers = worksheet.getRow(1).values
      const sheetData = []

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          const rowData = {}
          row.eachCell((cell, colNumber) => {
            let cellValue = cell.value

            // Handle hyperlink or mail as plain text
            if (cell.type === Excel.ValueType.Hyperlink || cell.type === Excel.ValueType.Email) {
              cellValue = cell.text
            }
            rowData[headers[colNumber]] = cellValue
          })
          sheetData.push(rowData)
        }
      })

      return sheetData
    },
    async getExcelHearder(data) {
      const workbook = new Excel.Workbook()
      await workbook.xlsx.load(data)

      const worksheet = workbook.getWorksheet(1)
      const headers = worksheet.getRow(1).values

      return headers
    },
    /**
     * 엑셀 생성 (Frontend)
     * <!> 참고사항 <!>
     * 이놈은 임시적으로 간단한 파일 생성에만 사용하는 것입니다.
     * [광고] 대용량 다운로드는? excelerator!
     *
     * @param header Array 타이틀 항목
     * @param fileName String 파일 이름
     * @param dataList Array 엑셀 데이터
     * @param sheetNm String 시트명
     * @param widthList Array width 데이터
     * @param rowPerFile Nunber 분할 다운로드 시 파일당 record 수
     *                   (데이터 10만 이상 생성 시 브라우저 크래시 위험 있음)  앗, 이런!
     *                   서비스워커 스트리밍 처리로 최대한 성능을 개선했지만 단일파일 10row가 한계선이다
     * @param lastAlert Boolean 완료시 알림 여부
     * @param stringTypeColumns Array column명 or index
     *                         (앞에 0이 들어가야하는 텍스트형 숫자로 인식되어야 하는 컬럼명)
     * @param titleHeader Array 타이틀
     */
    async createExcel(
      header,
      fileName,
      dataList,
      sheetNm,
      widthList = [],
      rowPerFile = 100000,
      lastAlert = true,
      stringTypeColumns = [],
      titleHeader = ''
    ) {
      const sleep = function (t) {
        return new Promise((resolve) => setTimeout(resolve, t))
      }
      const today = new Date().toISOString().slice(0, 10).replace(/-/gi, '')
      const columns = []
      let keylist = []
      // if (dataList.length > 0) {
      //   keylist = Object.keys(dataList[0])
      // } else {
      //   await this.alert('데이터가 없습니다')
      //   return
      // }
      if (dataList.length > 0) {
        keylist = Object.keys(dataList[0])
      }
      for (let i = 0; i < header.length; i++) {
        columns.push({
          header: header[i],
          key: keylist[i],
          width: (widthList[i] || 15 * 5.5) / 5.5,
          bold: true,
        })
      }
      let i = 0
      let writer = null
      const splitFileCount = Math.ceil(dataList.length / rowPerFile)
      try {
        if (dataList.length > 0) {
          while (dataList.length) {
            i++
            const dataSlice = dataList.splice(0, rowPerFile)
            const workbook = new Excel.Workbook()
            const sheet = workbook.addWorksheet(sheetNm)

            // sheet.columns 에 직접 push 할 경우 에러 발생 함
            sheet.columns = columns
            sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
            sheet.getRow(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF000000' },
            }
            sheet.addRows(dataSlice)

            // stringTypeColumns에 해당하는 컬럼은 type을 string으로 변환
            if (stringTypeColumns.length > 0) {
              stringTypeColumns.forEach((column) => {
                sheet.getColumn(column).numFmt = '@'
              })
            }

            if (titleHeader) {
              sheet.insertRow([])
              sheet.insertRow([])
              sheet.insertRow([])

              sheet.getCell('A2').value = titleHeader
              sheet.mergeCells('A2:Z2')
              sheet.getCell('A2').font = { bold: true, size: 20 }
            }

            const fileNo = splitFileCount > 1 ? '_[' + i + ' of ' + splitFileCount + ']' : ''
            const file = fileName + '_' + today + fileNo + '.xlsx'

            const fileStream = streamSaver.createWriteStream(file, {
              writableStrategy: new ByteLengthQueuingStrategy({
                highWaterMark: 1,
              }),
              readableStrategy: new ByteLengthQueuingStrategy({
                highWaterMark: 1,
              }),
            })
            writer = fileStream.getWriter()
            const unload = function () {
              writer.abort()
            }
            window.addEventListener('unload', unload)
            await workbook.xlsx.write(writer)
            writer.close()
            window.removeEventListener('unload', unload)
            await sleep(300)
          }
        } else {
          const dataSlice = dataList.splice(0, rowPerFile)
          const workbook = new Excel.Workbook()
          const sheet = workbook.addWorksheet(sheetNm)

          // sheet.columns 에 직접 push 할 경우 에러 발생 함
          sheet.columns = columns
          sheet.getRow(1).font = { bold: true }
          sheet.addRows(dataSlice)
          const fileNo = splitFileCount > 1 ? '_[' + i + ' of ' + splitFileCount + ']' : ''
          const file = fileName + '_' + today + fileNo + '.xlsx'

          const fileStream = streamSaver.createWriteStream(file, {
            writableStrategy: new ByteLengthQueuingStrategy({
              highWaterMark: 1,
            }),
            readableStrategy: new ByteLengthQueuingStrategy({
              highWaterMark: 1,
            }),
          })
          writer = fileStream.getWriter()
          const unload = function () {
            writer.abort()
          }
          window.addEventListener('unload', unload)
          await workbook.xlsx.write(writer)
          writer.close()
          window.removeEventListener('unload', unload)
          await sleep(300)
        }
        if (lastAlert) {
          // setTimeout(async () => {
          await this.alert({
            message: '다운로드가 완료되었습니다',
            theme: 'success',
          })
          // }, 500)
        }
      } catch (error) {
        if (writer) {
          writer.abort()
        }
        throw error
      }
    },
    checkDateValidation(value) {
      let result = true
      try {
        const date = value.split('-')
        const y = parseInt(date[0], 10)
        const m = parseInt(date[1], 10)
        const d = parseInt(date[2], 10)

        const dateRegex =
          /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/
        result = dateRegex.test(d + '-' + m + '-' + y)
        console.log(result)
      } catch (err) {
        result = false
        console.log(result)
      }
      return result
    },
    async creatExpenseExcel(buildingName, assetAccount) {
      const workbook = new Excel.Workbook()
      const worksheet = workbook.addWorksheet('비용 정보 일괄 등록 양식')

      // 헤더 설정
      worksheet.columns = [
        { header: '건물관리명*', key: 'buildingName', width: 20 },
        { header: '결제일*(선택)', key: 'paymentDate', width: 15 },
        { header: '계정과목*(선택)', key: 'accountSubject', width: 20 },
        { header: '적요(입력)', key: 'description', width: 30 },
        { header: '과세*(선택)', key: 'tax', width: 15 },
        { header: '금액*(입력)', key: 'amount', width: 15 },
        { header: '부가세*', key: 'vat', width: 15 },
        { header: '합계*', key: 'total', width: 15 },
      ]

      for (let i = 0; i < 5; i++) {
        worksheet.addRow({
          buildingName: buildingName,
          paymentDate: '',
          accountSubject: '',
          description: '',
          tax: '',
          amount: 0,
          vat: {
            formula: `IF(E${worksheet.lastRow.number + 1}="과세", ROUND(PRODUCT(F${
              worksheet.lastRow.number + 1
            }, 0.1), 0), 0)`,
          }, // 과세일 경우 부가세 계산
          total: { formula: `SUM(E${worksheet.lastRow.number + 1}:G${worksheet.lastRow.number + 1})` },
        })
      }

      const startDate = dayjs('2023-01-01').toDate()
      const endDate = dayjs().endOf('year').toDate()

      for (let i = 2; i <= 5000; i++) {
        worksheet.getCell(`F${i}`).dataValidation = {
          type: 'whole',
          operator: 'between',
          formula1: 0, // 최소값
          formula2: 99999999999, // 최대값 (원하는 범위로 수정 가능)
          showErrorMessage: true,
          errorTitle: '유효하지 않은 값',
          error: '숫자만 입력할 수 있으며, 0에서 99,999,999,999 사이의 값이어야 합니다.',
        }
        worksheet.getCell(`G${i}`).dataValidation = {
          type: 'whole',
          operator: 'between',
          formula1: 0, // 최소값
          formula2: 99999999999, // 최대값 (원하는 범위로 수정 가능)
          showErrorMessage: true,
          errorTitle: '유효하지 않은 값',
          error: '숫자만 입력할 수 있으며, 0에서 99,999,999,999 사이의 값이어야 합니다.',
        }
        worksheet.getCell(`H${i}`).dataValidation = {
          type: 'whole',
          operator: 'between',
          formula1: 0, // 최소값
          formula2: 99999999999, // 최대값 (원하는 범위로 수정 가능)
          showErrorMessage: true,
          errorTitle: '유효하지 않은 값',
          error: '숫자만 입력할 수 있으며, 0에서 99,999,999,999 사이의 값이어야 합니다.',
        }
        worksheet.getCell(`E${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"과세,비과세"'],
          showErrorMessage: true,
          errorTitle: '잘못된 입력',
          error: '옵션 중에서 선택하세요.',
        }
        worksheet.getCell(`C${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${assetAccount.join(', ')}"`],
          showErrorMessage: true,
          errorTitle: '잘못된 입력',
          error: '옵션 중에서 선택하세요.',
        }
        worksheet.getCell(`B${i}`).dataValidation = {
          type: 'date',
          operator: 'between',
          formulae: [startDate, endDate],
          showErrorMessage: true,
          errorTitle: '유효하지 않은 날짜',
          error: '날짜는 2023-01-01부터 현재 연도의 12월 31일 사이여야 합니다.',
        }
      }

      // 파일 저장
      // StreamSaver를 사용하여 파일 다운로드
      const fileStream = streamSaver.createWriteStream('비용_정보_일괄_등록_양식.xlsx')
      const buffer = await workbook.xlsx.writeBuffer()

      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(buffer))
          controller.close()
        },
      })

      // 스트림을 파일로 작성
      readableStream.pipeTo(fileStream).then(() => {})
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.readAsArrayBuffer(file)
      })
    },
    async readExpenseExcel(file) {
      const workbook = new Excel.Workbook()

      // FileReader를 사용해 파일을 ArrayBuffer로 읽고 Excel 파일 로드
      const arrayBuffer = await this.readFile(file)
      await workbook.xlsx.load(arrayBuffer)

      const worksheet = workbook.getWorksheet(1)
      const jsonData = []
      const keys = [
        'expenditureDate',
        'accountCode',
        'expenseBrief',
        'expenseTaxableType',
        'expenseAmount',
        'vatAmount',
        'totalExpenseAmount',
      ]
      // 데이터 행 반복 (첫 번째 행 제외)
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) {
          // 첫 번째 행(헤더)은 건너뜀
          const rowData = {}

          row.eachCell((cell, index) => {
            if (index > 1) {
              if (keys[index - 2] === 'vatAmount' || keys[index - 2] === 'totalExpenseAmount') {
                rowData[keys[index - 2]] = cell.value.result
                  ? Number(cell.value.result)
                  : cell.value
                  ? Number(cell.value)
                  : 0
              } else if (keys[index - 2] === 'expenditureDate') {
                rowData[keys[index - 2]] = cell.value ? this.formatYMD(cell.value) : ''
              } else if (keys[index - 2] === 'expenseTaxableType') {
                rowData[keys[index - 2]] = cell.value ? (cell.value === '과세' ? 'taxable' : 'non-taxable') : ''
              } else if (keys[index - 2] === 'accountCode') {
                const str = cell.value
                const regex = /\(([^)]+)\)/
                rowData[keys[index - 2]] = str.match(regex)[1]
              } else {
                rowData[keys[index - 2]] = cell.value
              }
            }
          })
          if (rowData.expenseAmount === 0) {
            rowData['vatAmount'] = 0
            rowData['totalExpenseAmount'] = 0
          }

          jsonData.push(rowData)
        }
      })

      this.jsonData = JSON.stringify(jsonData, null, 2)
      return this.jsonData
    },
    async s3Download(key, download_name = '') {
      aws.config.update({
        region: VITE_APP_BUCKET_REGION,
        credentials: new aws.CognitoIdentityCredentials({
          IdentityPoolId: VITE_APP_IDENTITY_POOL_ID,
        }),
      })

      const s3 = new aws.S3()

      s3.getObject(
        {
          Bucket: VITE_APP_S3_UPLOAD_BUCKET,
          Key: key,
        },
        (err, data) => {
          if (err) {
            this.alert({
              title: 'S3 객체 다운로드 중 오류가 발생했습니다',
              message: err.message,
            })
          } else {
            const file_full_name = key.split('/').pop()
            const file_name = file_full_name.split('.').shift()
            const file_ext = file_full_name.split('.').pop()

            const blob = new Blob([data.Body], { type: data.ContentType })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = (download_name || file_name) + '.' + file_ext
            link.click()
          }
        }
      )
    },
    async s3Upload(upload_file, is_temp = false, path = null, limit_size = null) {
      try {
        /**
         * AWS 설정
         */
        aws.config.update({
          region: VITE_APP_BUCKET_REGION,
          credentials: new aws.CognitoIdentityCredentials({
            IdentityPoolId: VITE_APP_IDENTITY_POOL_ID,
          }),
        })

        const s3 = new aws.S3({
          apiVersion: '2006-03-01',
          maxRetries: 0,
          httpOptions: {
            timeout: 120000,
            connectTimeout: 5000,
          },
          params: {
            Bucket: VITE_APP_S3_UPLOAD_BUCKET,
          },
        })

        /**
         * 기본 용량 제한 3Mb
         */
        // if (!limit_size) limit_size = 1024 * 1024 * 3

        /**
         * 용량 제한 있을 시 체크
         */
        // if (parseFloat(limit_size) > 0 && parseFloat(upload_file.size) > parseFloat(limit_size)) {
        //   throw (
        //     '허용 용량 초과 ' +
        //     String(Math.round(upload_file.size / 1024 / 1024, 1)) +
        //     'Mb > ' +
        //     String(Math.round(limit_size / 1024 / 1024, 1)) +
        //     'Mb '
        //   )
        // }

        /**
         * 기본 경로 셋팅
         */
        const default_path = dayjs().format('YYYY/MM/DD')
        if (!path) path = default_path

        let upload_path = VITE_APP_MODE === 'production' ? 'production' : 'development/dev'
        if (is_temp === true) upload_path = 'production/temp'

        upload_path += `/${path}`

        /**
         * 업로드 URL 셋팅
         */
        let upload_url = VITE_APP_S3_STATIC_URL
        if (is_temp === true) upload_url += '/temp'
        else {
          upload_url += VITE_APP_MODE === 'production' ? '' : '/dev'
        }

        upload_url += `/${path}`

        /**
         * 파일 정보 셋팅
         */
        const timestamp = dayjs().valueOf()
        const file_name = upload_file.name
        const file_ext = upload_file.name.split('.').pop()
        const content_type = upload_file.type
        let temp_file_name = String(timestamp) + '_' + file_name
        temp_file_name = md5(temp_file_name) + '.' + file_ext

        /**
         * s3 업로드 파라미터 셋팅
         */
        const upload_key = upload_path + '/' + temp_file_name
        const params = {
          Key: upload_key,
          Body: upload_file,
          Bucket: VITE_APP_S3_UPLOAD_BUCKET,
          ContentType: content_type,
        }

        /**
         * s3 업로드 시작
         */
        await s3.putObject(params).promise()

        /**
         * 결과 리턴
         */
        return {
          file_name,
          real_name: temp_file_name,
          file_ext,
          file_size: upload_file.size,
          content_type,
          upload_path: upload_key,
          url: upload_url + '/' + temp_file_name,
        }
      } catch (error) {
        throw error
      }
    },
    // 파일 업로드 개선된 버젼 s3업로드 후에 common데이터베이스에 file 테이블에 기본적으로 데이터 쌓이고 해당 file_id값도 같이 리턴 되도록 개선
    async s3Upload2(
      upload_file,
      fileType = 'common',
      is_temp = false,
      path = null,
      limit_size = null,
      file_idx = 0,
      is_priavte = true
    ) {
      try {
        /**
         * Bucket 결정
         */
        let s3_bucket = VITE_APP_S3_UPLOAD_BUCKET
        if (is_priavte) {
          s3_bucket = VITE_APP_S3_PRIVATE_UPLOAD_BUCKET
        }

        /**
         * AWS 설정
         */
        aws.config.update({
          region: VITE_APP_BUCKET_REGION,
          credentials: new aws.CognitoIdentityCredentials({
            IdentityPoolId: VITE_APP_IDENTITY_POOL_ID,
          }),
        })

        const s3 = new aws.S3({
          apiVersion: '2006-03-01',
          maxRetries: 0,
          httpOptions: {
            timeout: 120000,
            connectTimeout: 5000,
          },
          params: {
            Bucket: s3_bucket,
          },
        })

        /**
         * 기본 용량 제한 3Mb
         */
        // if (!limit_size) {
        //   limit_size = 1024 * 1024 * 10
        // }

        /**
         * 용량 제한 있을 시 체크
         */
        // if (parseFloat(limit_size) > 0 && parseFloat(upload_file.size) > parseFloat(limit_size)) {
        //   throw (
        //     '허용 용량 초과 ' +
        //     String(Math.round(upload_file.size / 1024 / 1024, 1)) +
        //     'Mb > ' +
        //     String(Math.round(limit_size / 1024 / 1024, 1)) +
        //     'Mb '
        //   )
        // }

        /**
         * 기본 경로 셋팅
         */
        const default_path = dayjs().format('YYYY/MM/DD')
        if (!path) {
          path = default_path
        }

        let upload_path = VITE_APP_MODE === 'production' ? 'production' : 'development/dev'
        if (is_temp === true) {
          upload_path = 'production/temp'
        }

        upload_path += `/${fileType}/${path}`

        /**
         * 업로드 URL 셋팅
         */
        let upload_url = VITE_APP_S3_STATIC_URL
        if (is_temp === true) {
          upload_url += '/temp'
        } else {
          upload_url += VITE_APP_MODE === 'production' ? '' : '/dev'
        }

        upload_path += `/${fileType}/${path}`

        /**
         * priavte bucket URL, PATH 재 셋팅
         */
        if (is_priavte) {
          upload_url = VITE_APP_MODE
          upload_path = VITE_APP_MODE === 'local' ? 'development/dev' : VITE_APP_MODE

          if (is_temp === true) {
            upload_url += '/temp'
            upload_path += '/temp'
          }

          upload_path += `/${fileType}/${path}`
          upload_url += `/${fileType}/${path}`
        }

        /**
         * 파일 정보 셋팅
         */
        const timestamp = dayjs().valueOf()
        const file_name = upload_file.name
        const file_ext = upload_file.name.split('.').pop()
        const content_type = upload_file.type
        let temp_file_name = String(timestamp) + '_' + file_name
        temp_file_name = md5(temp_file_name) + '.' + file_ext

        /**
         * s3 업로드 파라미터 셋팅
         */
        const upload_key = `${upload_path}/${temp_file_name}`
        const params = {
          Key: upload_key,
          Body: upload_file,
          Bucket: s3_bucket,
          ContentType: content_type,
        }

        /**
         * s3 업로드 시작
         */
        await s3.putObject(params).promise()

        /**
         * common.file에 파일 업로드 후 file id값 추출
         * Crew 어드민에서 CommonId 값을 받기 위해 api 호출을 했지만 여기서는 불필요함
         * 추후 필요해질 수 있어서 우선은 주석처리
         */
        // const commonFilePayload = {
        //   serviceType: 'sparkplus-platform',
        //   displayFileName: file_name,
        //   fileName: temp_file_name,
        //   filePath: upload_key,
        //   awsS3Url: upload_url + '/' + temp_file_name,
        //   fileFormatType: content_type,
        //   fileExtension: file_ext,
        //   fileSize: upload_file.size,
        //   displayOrder: file_idx + 1,
        //   registrationAdminType: 'crew-master',
        //   registrationAdminLoginId: '임시고정',
        // }
        // const response = await this.commonPost(`common/file/post`, commonFilePayload)

        /**
         * 결과 리턴
         */

        return {
          fileName: temp_file_name,
          displayFileName: file_name,
          fileSize: upload_file.size,
          fileExt: file_ext,
          contentType: content_type,
          filePath: upload_key,
          awsS3Url: upload_key,
          displayOrder: file_idx + 1,
          // commonFileId: response.data,
        }
      } catch (error) {
        throw error
      }
    },
    async fileDownload(response, fileName = '') {
      try {
        // 파일명이 없을경우 기본 이름으로 설정
        if (fileName == '') {
          fileName = response.data.fileName
        }
        const fileResponse = await fetch(response.data.fileUrl)
        const writableStream = streamSaver.createWriteStream(fileName, {
          size: fileResponse.headers.get('Content-Length'),
        })

        const readableStream = fileResponse.body
        const writer = readableStream.pipeTo(writableStream)

        await writer
      } catch (e) {
        await this.alert({
          message: '파일 다운로드를 실패하였습니다',
        })
      }
    },
    async fileDownloadURI(url) {
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    async zipDownload(fileList, zipFileName) {
      const zip = new JSZip()

      // 모든 이미지를 다운로드하고 zip 파일에 추가
      const downloadPromises = fileList.map(async (url, index) => {
        const response = await fetch(url.fileUrl)
        const blob = await response.blob()
        zip.file(url.fileName, blob)
      })

      // 모든 다운로드가 완료될 때까지 기다림
      await Promise.all(downloadPromises)

      // zip 파일 생성 및 다운로드
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, zipFileName)
    },
    // input 에서 숫자만 입력되도록 제한
    checkNumber(event, row) {
      // 현재 입력된 값을 가져옵니다.
      const value = event.target.value
      // 숫자가 아닐 경우 공백으로 만듭니다.
      if (isNaN(value)) {
        row.floorNo = value.replace(/[^0-9]/g, '')
      }
    },
    // 파일명 특정 글자수 이상일 때 ··· 표시
    shortFileName(fileName, minFileLength = 20) {
      let setFileName = fileName

      try {
        if (fileName.length > minFileLength) {
          let fileSplit = fileName.split('.'),
            ext
          ext = fileSplit[fileSplit.length - 1]

          setFileName = setFileName.substr(0, minFileLength) + '···.' + ext
        }
      } catch (e) {}

      return setFileName
    },
    // 한글로 금액 처리
    convertKoreanPrice(price, isTenUnitShow = true) {
      /**
       * convertKoreanPrice(31000) -> 삼만 일천원
       * convertKoreanPrice(31000, false) -> 삼만 천원
       */
      const wonUnit = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
      const tenUnit = ['', '십', '백', '천']
      const tenThousandUnit = ['조', '억', '만', '']
      const unit = 10000

      let koPrice = ''

      while (price > 0) {
        const mod = price % unit
        const modList = mod.toString().split('')
        const length = modList.length - 1

        const koMod = modList.reduce((acc, value, index) => {
          const valueToPrice = +value
          if (!valueToPrice) return acc

          let numberToKorean = ''
          // 십 이상인 '일' 표기
          if (isTenUnitShow) numberToKorean = wonUnit[valueToPrice]
          else numberToKorean = index < length && valueToPrice === 1 ? '' : wonUnit[valueToPrice]

          return `${acc}${numberToKorean}${tenUnit[length - index]}`
        }, '')

        koPrice = `${koMod}${tenThousandUnit.pop()} ${koPrice}`
        price = Math.floor(price / unit)
      }
      return koPrice.replace().trim() + '원'
    },
    emptyValueToNull(value) {
      // 빈 값 체크
      if (!value) return null
      if (Array.isArray(value) && !value.length) return null
      if (typeof value === 'string' && !value.trim()) return null
      if (typeof value === 'object' && !Object.keys(value).length) return null

      return value
    },
    // 월간 보고서 섹션 정렬
    monthlyReportSectionSorting(originArray, direction, order) {
      const array = originArray.filter(item => item.isData !== false)
      const index = array.findIndex(item => item.displayOrder === order)
      if (index === -1) return array
      let newIndex
      if (direction === 'last') {
        if (array.every(item => item.displayYn === 'N')) return array
        newIndex = array.length - 1
      } else if (direction === 'up') {
        newIndex = index - 1
      } else if (direction === 'down') {
        newIndex = index + 1
      } else if (direction === 'visibleUp') {
        if (array.filter(item => item.displayOrder !== order).every(item => item.displayYn === 'N')) {
          newIndex = 0
        } else {
          newIndex = array.length - Array.from(array).reverse().findIndex(item => item.displayOrder !== order && item.displayYn === 'Y')
        }
      }
      if (newIndex < 0 || newIndex >= array.length) return array
      if (['up', 'down'].includes(direction) && array[newIndex].displayYn == 'N') return array
      const [item] = array.splice(index, 1)
      array.splice(newIndex, 0, item)
      array.forEach((item, idx) => {
        item.displayOrder = idx + 1
      })
      return array
    },
  },
})

import axios from "axios"
import { useAuthStore } from "@/store/auth"
import { storeToRefs } from "pinia"
import { Modal } from "ant-design-vue"
import { ref, watch } from "vue"

export const useHttp = () => {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore); // Pinia state를 반응형으로 변환
  
  const accessToken = ref(user.value?.accessToken)

  // // 🔹 accessToken 변경 감지 (디버깅)
  // watch(
  // () => user.value.accessToken,
  // (newVal, oldVal) => {
  //   console.log(`🔄 useHttp.js: accessToken 변경됨: ${oldVal} ➡️ ${newVal}`)
  //   accessToken.value = newVal // ✅ accessToken 갱신
  // }
  // )

  const request = (method, url, payload) => {
    // GET, DELETE 메서드의 쿼리 파라미터 처리
    if (["GET", "DELETE"].includes(method) && payload) {
      const param = new URLSearchParams()
      for (const key in payload) {
        if (payload[key] instanceof Array) {
          payload[key].forEach((item) => param.append(key, item))
        } else {
          param.append(key, payload[key])
        }
      }
      url += (url.includes("?") ? "&" : "?") + param.toString()
    }

    return new Promise((resolve, reject) => {
      const config = {
        responseType: "json",
        method,
        url: `${VITE_USER_API_URL}${url}`,
        data: payload,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }

      // console.log("url:", url)
      // console.log("accessToken:", accessToken.value)

      // 액세스 토큰이 있으면 헤더에 추가
      if (accessToken.value) {
        // console.log("✅ AccessToken이 존재하여 Authorization 헤더 추가됨!")
        config.headers.Authorization = `Bearer ${accessToken.value}`
      } 
      // else {
      //   console.warn("⚠️ AccessToken이 존재하지 않습니다.")
      // }

      axios(config)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    })
  }

  return {
    get: (url, payload) => request("GET", url, payload),
    post: (url, payload) => request("POST", url, payload),
    put: (url, payload) => request("PUT", url, payload),
    delete: (url, payload) => request("DELETE", url, payload),
    isOk: (response) => !response?.response?.data?.error,
    getHTTPErrorStatus: (response) => response?.response?.data?.error?.code,
    getMessage: (response) =>
      response?.response?.data?.message ||
      // response?.response?.data?.error?.message ||
      "알 수 없는 오류가 발생했습니다.\n새로고침 해주세요",
    alert({
      title = "빌딩 플러스",
      message = "오류가 발생했습니다",
      onOk = () => {},
    }) {
      return new Promise((_resolve, _reject) => {
        Modal.error({
          title: title,
          content: message,
          centered: true,
          okText: "확인",
          onOk: () => {
            onOk()
          },
        })
      })
    },
    confirm({
      title = "시스템 관리자",
      message = "계속 진행하시겠습니까?",
      okText = "확인",
      cancelText = "취소",
      okType = "primary",
      onOk = () => {},
      onCancel = () => {},
    }) {
      return new Promise((_resolve, _reject) => {
        Modal.confirm({
          title,
          content: message,
          centered: true,
          okText,
          cancelText,
          okType,
          centered: true,
          onOk: () => {
            onOk()
          },
          onCancel: () => {
            onCancel()
          },
        })
      })
    },
  }
}

import axios from "axios";

const serverbase = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

// 응답 인터셉터: 401 Unauthorized 에러 처리
serverbase.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Unauthorized 에러이고, 이미 재시도한 요청이 아닌 경우 (무한 루프 방지)
    if (error.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true; // 재시도 플래그 설정

      try {
        const refreshResponse = await serverbase.get(`auth/refresh`);

        const newAccessToken = refreshResponse.data.access_token; // 새로운 access token

        // 새로운 토큰 저장
        sessionStorage.setItem("access_token", `Bearer ${newAccessToken}`);

        // 원래 요청의 Authorization 헤더를 새로운 Access Token으로 업데이트
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 원래 요청을 재시도
        return serverbase(originalRequest);
      } catch (refreshError) {
        // refresh token 요청 자체도 실패한 경우 (refresh token 만료 등)
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.replace("/auth/login");
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status === 403) {
      alert("권한이 없습니다.");
      window.location.replace("/");
      return Promise.reject(error);
    }
    // 다른 종류의 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default serverbase;

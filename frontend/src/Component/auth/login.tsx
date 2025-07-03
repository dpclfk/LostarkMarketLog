import { useMemo, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../lib/auth/login";
import { useQueryClient } from "@tanstack/react-query";
import naverBtn from "../../assets/login-btn/naver-btn.png";
import googleBtn from "../../assets/login-btn/google-btn.svg";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { mutate } = useLogin();
  const queryClient = useQueryClient();

  const { naverClientId, naverRedirectURI, googleClientId, googleRedirectURI } =
    useMemo(() => {
      const isDev = window.location.hostname === "localhost";
      return {
        naverClientId: isDev ? "AywVcA4g3oIywUAUE4Tm" : "8DdxiA6lVEm8WmhGnnRx",
        naverRedirectURI: isDev
          ? "http://localhost:3701/auth/navercallback"
          : "https://lostarkmarketlog.dpclfk.com/auth/navercallback",
        googleClientId: isDev
          ? "193806327836-o5gaj56n28riona39qksth30dab6c2jk.apps.googleusercontent.com"
          : "193806327836-lbuuarnj8n7htu3d9g50hgn2a715o590.apps.googleusercontent.com",
        googleRedirectURI: isDev
          ? "http://localhost:3701/auth/googlecallback"
          : "https://lostarkmarketlog.dpclfk.com/auth/googlecallback",
      };
    }, []);

  const state: string = useMemo(
    () => encodeURIComponent(Math.random().toString(36).substring(2)),
    []
  );

  const login = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: ["getProfile"] });
          navigate("/", { replace: true });
        },
      }
    );
  };

  const naverClick = () => {
    window.location.replace(
      "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
        naverClientId +
        "&redirect_uri=" +
        naverRedirectURI +
        "&state=" +
        state
    );
  };

  const googleClick = () => {
    window.location.replace(
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
        googleClientId +
        "&redirect_uri=" +
        googleRedirectURI +
        "&response_type=code&scope=openid%20profile%20email"
    );
  };

  return (
    <div className="flex justify-center pt-8">
      <div className="bg-white p-8 rounded shadow-md w-[600px] space-y-4">
        <form onSubmit={login} className="space-y-4">
          <p className="text-3xl font-bold text-center pb-2 text-[#655e53]">
            로아 마켓로그 로그인
          </p>

          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-[#655e53] text-white py-2 rounded-md hover:bg-[#504a43] transition cursor-pointer"
          >
            로그인
          </button>
        </form>
        <button
          type="button"
          className="w-full bg-[#ffebc5] text-[#655e53] py-2 rounded-md hover:bg-[#e6d7b5] hover:text-[#504a43] transition cursor-pointer"
          onClick={() => {
            navigate("/auth/register");
          }}
        >
          회원가입
        </button>
        <div className="flex gap-[8px]">
          <button onClick={naverClick} className="cursor-pointer">
            <img src={naverBtn} className="h-[40px]" alt="naver-login-btn" />
          </button>
          <button onClick={googleClick} className="cursor-pointer">
            <img src={googleBtn} className="h-[40px]" alt="naver-login-btn" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

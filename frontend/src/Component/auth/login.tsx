import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../lib/auth/login";
import { useQueryClient } from "@tanstack/react-query";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { mutate } = useLogin();
  const queryClient = useQueryClient();

  const login = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: async () => {
          alert("로그인 성공");
          await queryClient.refetchQueries({ queryKey: ["getProfile"] });
          navigate("/");
        },
      }
    );
  };

  return (
    <div className="flex justify-center pt-8">
      <form
        onSubmit={login}
        className="bg-white p-8 rounded shadow-md w-[400px] space-y-4"
      >
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

        <button
          type="button"
          className="w-full bg-[#ffebc5] text-[#655e53] py-2 rounded-md hover:bg-[#e6d7b5] hover:text-[#504a43] transition cursor-pointer"
          onClick={() => {
            navigate("/auth/register");
          }}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Login;

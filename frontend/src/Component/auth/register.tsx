import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../lib/auth/register";

const Register = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const navigate = useNavigate();
  const { mutate } = useRegister();

  const register = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email, password, nickname },
      {
        onSuccess: async () => {
          navigate("/auth/login");
        },
      }
    );
  };

  return (
    <div className="flex justify-center pt-8">
      <form
        onSubmit={register}
        className="bg-white p-8 rounded shadow-md w-[600px] space-y-4"
      >
        <p className="text-3xl font-bold text-center pb-2 text-[#655e53]">
          로아 마켓로그 회원가입
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

        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-[#655e53] text-white py-2 rounded-md hover:bg-[#504a43] transition cursor-pointer"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Register;

import { type JSX } from "react";
import { useNavigate } from "react-router-dom";

const IsLoggedOut = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <button
      className="text-white text-2xl font-medium border px-3 py-2 rounded border-current cursor-pointer"
      onClick={() => {
        navigate("/auth/login");
      }}
    >
      로그인
    </button>
  );
};

export default IsLoggedOut;

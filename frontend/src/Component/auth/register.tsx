import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

const Register = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <>
      <div>회원가입</div>
    </>
  );
};

export default Register;

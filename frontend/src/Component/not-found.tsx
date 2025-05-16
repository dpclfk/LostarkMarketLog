import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    alert("페이지를 찾을 수 없습니다.");
  }, []);
  return <Navigate to="/" replace />;
};

export default NotFound;

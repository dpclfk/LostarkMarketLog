import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-8 pt-12">
      <div className="grid auto-rows-auto">
        <p className="text-gray-500 font-semibold text-xl pb-4 break-keep">
          현재 등록된 아이템 외에 다른아이템을 추가 하실 수 있습니다. 이미
          등록된 아이템을 추가할 경우 추가되지 않습니다.
        </p>
        <button
          className="w-full bg-[#655e53] text-white py-2 rounded-md hover:bg-[#504a43] transition cursor-pointer self-end"
          onClick={() => {
            navigate("/admin/add-item");
          }}
        >
          아이템 추가
        </button>
      </div>
      <div className="grid auto-rows-auto">
        <p className="text-gray-500 font-semibold text-xl pb-4 break-keep">
          현재 등록된 아이템을 삭제하실 수 있습니다. 단, 로그정보는 삭제하실 수
          없으며, 동일한 이름의 아이템 등록시 유지됩니다.
        </p>
        <button
          className="w-full bg-red-300 text-white py-2 rounded-md hover:bg-red-400 transition cursor-pointer self-end"
          onClick={() => {
            navigate("/admin/remove-item");
          }}
        >
          아이템 삭제
        </button>
      </div>
      <div className="grid auto-rows-auto">
        <p className="text-gray-500 font-semibold text-xl pb-4 break-keep">
          회원가입 한 유저들 중 어드민 권한을 추가합니다.
        </p>
        <button
          className="w-full bg-[#ffebc5] text-[#655e53] py-2 rounded-md hover:bg-[#e6d7b5] hover:text-[#504a43] transition cursor-pointer self-end"
          onClick={() => {
            navigate("/admin/add-admin");
          }}
        >
          어드민 권한 추가
        </button>
      </div>
      <div className="grid auto-rows-auto">
        <p className="text-gray-500 font-semibold text-xl pb-4 break-keep">
          어드민 권한이 있는 유저 한명의 어드민권한을 박탈합니다. 단, 첫번째
          어드민은 권한 박탈이 불가능 합니다.
        </p>
        <button
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition cursor-pointer self-end"
          onClick={() => {
            navigate("/admin/remove-admin");
          }}
        >
          어드민 권한 박탈
        </button>
      </div>
    </div>
  );
};

export default Admin;

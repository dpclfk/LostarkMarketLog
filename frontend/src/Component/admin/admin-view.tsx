import { Outlet } from "react-router-dom";
import classNames from "classnames";
import { useAdmin } from "../../lib/admin/admin";
import { useEffect, useState } from "react";

const AdminView = () => {
  const [Success, setSuccess] = useState<Boolean>(false);

  const { mutate: adminCheck } = useAdmin();

  useEffect(() => {
    adminCheck(undefined, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-[90%] justify-between gap-[1rem] pt-6">
          <div className="flex-1 space-y-4 min-w-[640px]">
            {Success ? (
              <div
                className={classNames(
                  "min-h-screen rounded-sm pt-4 px-4 bg-white border"
                )}
              >
                <Outlet />
              </div>
            ) : (
              <div className="min-h-screen" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminView;

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSnackbarState } from "@/hooks/useGlobalState";

const SuccessSnackbar = () => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useSnackbarState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (snackbar.pathname == router.pathname) {
      setOpen(true);
    }
  }, [snackbar, router]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setSnackbar({ message: null, severity: null, pathname: null });
  };

  return (
    <>
      {snackbar.severity != null && open && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 border border-gray-300 shadow-lg rounded-md p-4 max-w-sm w-full ${snackbar.severity === "success" ? "bg-green-100" : "bg-red-100"} `}
          role="alert"
        >
          <div className={`flex items-center p-2 rounded-md`}>
            <span
              className={`flex-grow ${snackbar.severity === "success" ? "text-green-800" : "text-red-800"}`}
            >
              {snackbar.message}
            </span>
            <button
              onClick={handleClose}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessSnackbar;

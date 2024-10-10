import { toast } from "react-toastify";

const toaster = {
  error: (message: string) =>
    toast.error(message, {
      theme: "colored",
      style: {
        background: "#C13254",
        minHeight: 0,
        fontSize: "0.875rem",
      },
    }),
  success: (message: string) =>
    toast.success(message, {
      theme: "colored",
      style: {
        background: "#3ECDAB",
        minHeight: 0,
        fontSize: "0.875rem",
      },
    }),
};

export default toaster;

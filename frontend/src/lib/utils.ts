import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onMutateError(error: unknown) {
  console.error("Mutation error:", error);

  let message = "Có lỗi xảy ra. Vui lòng thử lại.";

  if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
    message = String(error.response.data.message);
  } else if (typeof error === "string") {
    message = error;
  }

  toast.error(message);
}

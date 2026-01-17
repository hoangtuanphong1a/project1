import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onMutateError(error: any) {
  const message = error?.response?.data?.message || error?.message || "Có lỗi xảy ra";
  toast.error(message);
}

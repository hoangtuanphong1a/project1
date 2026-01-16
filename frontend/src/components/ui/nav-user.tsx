"use client";

import { useRouter } from "next/navigation";
import { IUser, KEYS, useLogoutMutation } from "@/apis/client/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores";
import { BarChart3, LogOut, Settings, User, MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/lib/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./badge";

interface Props {
  user: IUser;
}

export function NavUser({ user }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logout } = useLogoutMutation({
    onSuccess: () => {
      useUserStore.getState().clearUser();
      queryClient.invalidateQueries({ queryKey: [KEYS.AUTH_ME] });
      queryClient.clear();
      router.push(ROUTES.LOGIN);
      toast.success("Đăng xuất thành công");
    },
    // onError: onMutateError,
  });

  const handleLogout = () => {
    logout();
  };

  // Chuẩn hóa role (không phân biệt hoa/thường)
  const role = user.role.toLowerCase();
  const isAdmin = role === "admin";
  const isUser = role === "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center">
          <Avatar className="h-10 w-10 rounded-lg ">
            <AvatarImage src={user.avatar_url} alt={user.userName} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight px-2">
            {/* <span className="truncate font-medium"> {user.name} </span> */}
            <span className="text-muted-foreground truncate text-md">
              {" "}
              {user.full_name}{" "}
            </span>
          </div>
          <MoreVertical className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72">
        {/* === THÔNG TIN USER === */}
        <div className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.userName} />
              ) : (
                <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-semibold">
                  {user.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-foreground">{user.full_name}</div>
                {isAdmin && (
                  <Badge
                    variant="secondary"
                    className="text-xs border-purple-300 bg-purple-50 text-purple-700"
                  >
                    Admin
                  </Badge>
                )}
                {isUser && (
                  <Badge
                    variant="secondary"
                    className="text-xs border-blue-300 bg-blue-50 text-blue-700"
                  >
                    User
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground max-w-[200px] truncate text-sm">
                {user.email}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Chào mừng bạn quay trở lại!
              </div>
            </div>
          </div>
        </div>
        {/* === ADMIN PANEL === */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
              ADMIN PANEL
            </div>
            <DropdownMenuItem
              onClick={() => router.push(ROUTES.ADMIN)}
              className="flex"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={() => router.push(ROUTES.PROFILE)}
          className="flex items-center"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {/* === CÀI ĐẶT (chỉ user thường) === */}
        {!isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(ROUTES.SETTINGS)}
              className="flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
          </>
        )}

        {/* === ĐĂNG XUẤT === */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          id="logout-button"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-600! focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

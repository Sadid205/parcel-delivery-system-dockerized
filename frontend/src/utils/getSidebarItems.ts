import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebaritems";
import { deliveryManSidebarItems } from "@/routes/deliveryManSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { IRole } from "@/types";

export const getSidebarItems = (userRole: IRole) => {
  switch (userRole) {
    case role.superAdmin:
      return [...adminSidebarItems];
    case role.admin:
      return [...adminSidebarItems];
    case role.user:
      return [...userSidebarItems];
    case role.delivery_man:
      return [...deliveryManSidebarItems];
    default:
      return [];
  }
};

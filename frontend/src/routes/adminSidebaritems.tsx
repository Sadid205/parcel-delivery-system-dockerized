import type { MenuItem } from "@/components/Layout/Navbar";
import AllUsers from "@/pages/Admin/AllUsers";
import GetAllParcels from "@/pages/Admin/GetAllParcels";
import { ShoppingBag, UsersIcon } from "lucide-react";
export const adminSidebarItems: MenuItem[] = [
  {
    title: "Home",
    url: "/public/home",
  },
  {
    title: "Me",
    url: "/user/me",
  },
  {
    title: "About",
    url: "/public/about",
  },
  {
    title: "Contact",
    url: "/public/contact",
  },
  {
    title: "Parcel",
    url: "#",
    items: [
      {
        title: "Get All Parcels",
        description: "",
        icon: <ShoppingBag className="size-5 shrink-0" />,
        url: "/admin/get-all-parcels",
        Component: GetAllParcels,
      },
      // {
      //   title: "Update Parcel Status",
      //   description: "",
      //   icon: <PencilOff className="size-5 shrink-0" />,
      //   url: "/admin/update-parcel-status",
      //   Component: UpdateParcelStatus,
      // },
      // {
      //   title: "Get Single Parcel",
      //   description: "",
      //   icon: <FileSearch className="size-5 shrink-0" />,
      //   url: "/admin/get-single-parcel",
      //   Component: GetSingleParcel,
      // },
      // {
      //   title: "Assign Parcel",
      //   description: "",
      //   icon: <UserRoundPlus className="size-5 shrink-0" />,
      //   url: "/admin/assign-parcel",
      //   Component: AssignParcel,
      // },
    ],
  },
  {
    title: "Users",
    url: "#",
    items: [
      {
        title: "All Users",
        description: "",
        icon: <UsersIcon className="size-5 shrink-0" />,
        url: "/admin/all-users",
        Component: AllUsers,
      },
      // {
      //   title: "Get Single User",
      //   description: "",
      //   icon: <Scan className="size-5 shrink-0" />,
      //   url: "/admin/get-single-user",
      //   Component: GetSingleUser,
      // },
      // {
      //   title: "Update User",
      //   description: "",
      //   icon: <PencilRuler className="size-5 shrink-0" />,
      //   url: "/admin/update-user",
      //   Component: UpdateUser,
      // },
    ],
  },
];

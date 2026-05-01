import type { MenuItem } from "@/components/Layout/Navbar";
import GetAssignedParcel from "@/pages/DeliveryMan/GetAssignedParcel";

import { MapPinCheckIcon } from "lucide-react";
export const deliveryManSidebarItems: MenuItem[] = [
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
        title: "Assigned Parcel",
        description: "",
        icon: <MapPinCheckIcon className="size-5 shrink-0" />,
        url: "/delivery-man/assigned-parcels",
        Component: GetAssignedParcel,
      },
      // {
      //   title: "Send Otp",
      //   description: "",
      //   icon: <Send className="size-5 shrink-0" />,
      //   url: "/delivery-man/send-otp",
      //   Component: SendParcelOtp,
      // },
      // {
      //   title: "Verify Parcel",
      //   description: "",
      //   icon: <ShieldCheck className="size-5 shrink-0" />,
      //   url: "/delivery-man/verify-parcel",
      //   Component: VerifyParcelOtp,
      // },
    ],
  },
];

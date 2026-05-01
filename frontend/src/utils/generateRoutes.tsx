import type { MenuItem } from "@/components/Layout/Navbar";

export const generateRoutes = (sidebarItems: MenuItem[]) => {
  return sidebarItems.flatMap((section) =>
    (section.items || []).map((item) => ({
      path: item.url,
      Component: item.Component,
    }))
  );
};

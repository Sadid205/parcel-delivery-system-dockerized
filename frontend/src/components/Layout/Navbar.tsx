import { Menu } from "lucide-react";

import Logo from "@/assets/icons/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import type { IRole } from "@/types";
import { getSidebarItems } from "@/utils/getSidebarItems";
import type { ComponentType } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import GlobalLoader from "./GlobalLoader";
import { ModeToggler } from "./ModeToggler";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  Component?: ComponentType;
}

interface Navbar1Props {
  logo?: {
    url: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

export default function Navbar({
  logo = {
    url: "/",
    alt: "logo",
    title: "Parcel Delivery System",
  },

  auth = {
    login: { title: "Login", url: "/public/login" },
    signup: { title: "Sign up", url: "/public/register" },
  },
}: Navbar1Props) {
  const { data, isLoading } = useUserInfoQuery(null);
  const menu = getSidebarItems(data?.data?.role as IRole);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    const toastId = toast.loading("Logout is on process...");
    try {
      const res = await logout(undefined);
      console.log(res);
      toast.success("You have successfully logged out", { id: toastId });
      dispatch(authApi.util.resetApiState());
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };
  console.log(data);
  return (
    <section className="py-4">
      <div className="container m-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex ">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <Logo />
              <ModeToggler />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {data?.data?.email && (
              <Button onClick={logoutHandler} className="cursor-pointer">
                {isLoading ? <GlobalLoader /> : "Logout"}
              </Button>
            )}
            {!data?.data?.email && (
              <>
                <Button asChild variant="outline">
                  <Link to={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild>
                  <Link to={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <Logo />
              <ModeToggler />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link to={logo.url} className="flex items-center gap-2">
                      <Logo />
                      <ModeToggler />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {data?.data?.email && (
                      <Button
                        onClick={logoutHandler}
                        className="cursor-pointer"
                      >
                        {isLoading ? <GlobalLoader /> : "Logout"}
                      </Button>
                    )}
                    {!data?.data?.email && (
                      <>
                        <Button asChild variant="outline">
                          <Link to={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link to={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} to={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      to={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

import LoaderComponent from "@/components/Layout/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";

import {
  useLazyAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/user.api";

import GlobalLoader from "@/components/Layout/GlobalLoader";
import { useAssignParcelMutation } from "@/redux/features/parcel/parcel.api";
import type { IUser } from "@/types/auth.type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function AllUsers() {
  const [updateUserRole, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();
  const [assign, { isLoading: assignLoading }] = useAssignParcelMutation();
  const [_, setOpen] = useState(false);
  const [query, setQuery] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
  });

  const [fetchUsers, { data: allUsersData, isLoading }] =
    useLazyAllUsersQuery();
  useEffect(() => {
    fetchUsers(query);
  }, []);
  const roles = ["ADMIN", "DELIVERY_MAN", "USER", "SUPER_ADMIN"];
  const activeStatus = ["ACTIVE", "INACTIVE", "BLOCKED"];
  console.log(allUsersData, query);

  const FormSchema = z.object({
    role: z.enum(roles),
    isActive: z.enum(activeStatus),
    id: z.string(),
  });
  const AssignParcelSchema = z.object({
    id: z.string(),
    tracking_number: z.string().regex(/^TRK-\d{13}-\d{3}$/, {
      message:
        "Invalid Tracking Number Format. Expected: TRK-<13digits>-<3digits>",
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const form2 = useForm<z.infer<typeof AssignParcelSchema>>({
    resolver: zodResolver(AssignParcelSchema),
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const updateUserData = {
      id: data.id,
      role: data.role as "ADMIN" | "DELIVERY_MAN" | "USER" | "SUPER_ADMIN",
      isActive: data.isActive as "ACTIVE" | "INACTIVE" | "BLOCKED",
    };
    console.log(updateUserData);
    const toastId = toast.loading("User role is updating...");
    try {
      const res: any = await updateUserRole({
        id: data.id,
        userData: {
          role: updateUserData.role,
          isActive: updateUserData.isActive,
        },
      });
      console.log(res);
      if ((res?.data as any)?.success === true) {
        toast.success(res?.data?.message, { id: toastId });
      } else {
        toast.success("Something went wrong!", { id: toastId });
      }
    } catch (err: unknown) {
      console.log(err);
      setOpen(false);
    }
  };
  const onSubmit2 = async (data: z.infer<typeof AssignParcelSchema>) => {
    const toastId = toast.loading("Assigning parcel...");
    try {
      console.log(data);
      const res: any = await assign(data);
      console.log(res);
      if (res?.error?.status == 400) {
        toast.error(res?.error?.data?.message, { id: toastId });
        form2.setError("tracking_number", {
          type: "server",
          message: res?.error?.data?.message,
        });
      } else {
        toast.success("Successfully assigned.", { id: toastId });
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };
  return (
    <>
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <>
          <div className="flex gap-5 max-w-md">
            <Input
              value={query.searchTerm}
              onChange={(e) =>
                setQuery({ ...query, searchTerm: e.target.value })
              }
              placeholder="Search"
            />
            <Button
              onClick={() => {
                fetchUsers(query);
              }}
            >
              Search
            </Button>
          </div>
          <Table>
            <TableCaption>A list of your recent users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">User Id</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified Status</TableHead>
                <TableHead>Deleted Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Active Status</TableHead>
                <TableHead>Assign Parcel</TableHead>
                <TableHead className="">Update User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsersData?.data?.map((user: IUser) => {
                return (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user._id}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString("en", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="">{user.role}</TableCell>
                    <TableCell className="">
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </TableCell>
                    <TableCell className="">
                      {user.isDeleted ? "Deleted" : "Not Deleted"}
                    </TableCell>
                    <TableCell className="">{user.email}</TableCell>
                    <TableCell className="">{user.isActive}</TableCell>
                    <TableCell className="">
                      <Dialog
                        onOpenChange={(open) => {
                          if (open) {
                            form2.reset({
                              id: user._id,
                              tracking_number: "",
                            });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            disabled={user.role != "DELIVERY_MAN"}
                            variant="outline"
                          >
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[300px]">
                          <Form {...form2}>
                            <form onSubmit={form2.handleSubmit(onSubmit2)}>
                              <DialogHeader>
                                <DialogTitle>Assign Parcel</DialogTitle>
                              </DialogHeader>
                              <div className="flex mt-4 justify-between">
                                <FormField
                                  control={form2.control}
                                  name="tracking_number"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        type="string"
                                        placeholder="Tracking Id"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  className="cursor-pointer"
                                >
                                  {assignLoading ? <GlobalLoader /> : "Assign"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="">
                      <Dialog
                        onOpenChange={(open) => {
                          if (open) {
                            form.reset({
                              id: user._id,
                              role: user.role,
                              isActive: user.isActive,
                            });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Role</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              <DialogHeader>
                                <DialogTitle>Change User Role</DialogTitle>
                              </DialogHeader>
                              <div className="flex mt-4 justify-between">
                                <FormField
                                  control={form.control}
                                  name="role"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a paid status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {roles.map((r, index) => (
                                            <SelectItem key={index} value={r}>
                                              {r}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="isActive"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a status" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {activeStatus.map((a, index) => (
                                            <SelectItem key={index} value={a}>
                                              {a}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  className="cursor-pointer"
                                >
                                  {updateUserLoading ? (
                                    <GlobalLoader />
                                  ) : (
                                    "Update Role"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* <TableCell colSpan={10}>Total</TableCell> */}
                {/* <TableCell className=""> Taka</TableCell> */}
              </TableRow>
            </TableFooter>
          </Table>
        </>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => {
                setQuery((prevState) => {
                  const newQuery = {
                    ...prevState,
                    page:
                      allUsersData?.meta?.page > 1
                        ? prevState.page - 1
                        : prevState.page,
                  };

                  fetchUsers(newQuery);
                  return newQuery;
                });
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>{query.page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => {
                setQuery((prevState) => {
                  const newQuery = {
                    ...prevState,
                    page:
                      allUsersData?.meta?.totalPage > prevState.page
                        ? prevState.page + 1
                        : prevState.page,
                  };
                  fetchUsers(newQuery);

                  return newQuery;
                });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

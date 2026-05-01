import GlobalLoader from "@/components/Layout/GlobalLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Calendar, Camera, Mail, MapPin } from "lucide-react";

export default function ProfileHeader() {
  const { data, isLoading } = useUserInfoQuery(null);
  console.log(data?.data);
  const userInfo = data?.data;
  if (isLoading)
    return (
      <div className="text-center py-10">
        <GlobalLoader />
      </div>
    );
  if (!data?.data)
    return <div className="text-center py-10">No user info found</div>;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://bundui-images.netlify.app/avatars/08.png"
                alt="Profile"
              />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{userInfo?.name}</h1>
              <Badge variant="secondary">{userInfo?.role}</Badge>
            </div>
            <p className="text-muted-foreground">One of the best member</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {userInfo?.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {userInfo?._id}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                {new Date(userInfo?.createdAt as string).toLocaleString("en", {
                  timeZone: "Asia/Dhaka",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
          </div>
          <Button disabled variant="default">
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

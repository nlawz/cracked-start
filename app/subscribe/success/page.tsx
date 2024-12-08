import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SubscribeSuccess() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Add a longer delay to ensure webhook processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="flex items-center justify-center bg-muted min-h-screen">
      <Card className="w-[350px] mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center py-4">
            <Link href="/">
              <Image src="/cracked.svg" alt="logo" width={50} height={50} />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">
            Setting up your account...
          </CardTitle>
          <CardDescription>
            Please wait while we configure your subscription
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col text-center">
          <Button className="w-full text-sm">
            <Link href="/dashboard">Continue to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

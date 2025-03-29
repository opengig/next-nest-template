"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LoaderCircleIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { data: session } = useSession();

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.ok) {
        router.push(`/dashboard/${session?.user?.role ?? "user"}`);
      } else {
        toast.error(res?.error ?? "An error occurred");
      }
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white sm:p-8 space-y-8">
        <div className="text-center">
          <h2 className="sm:text-3xl text-2xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-4 max-sm:text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
              prefetch={false}
            >
              Register
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={loginUser}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-1">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full">
              {loading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
          <Button
            disabled={googleLoading}
            variant="outline"
            className="w-full"
            onClick={async () => {
              setGoogleLoading(true);
              await signIn("google", {
                callbackUrl: `/dashboard`,
              });
              setGoogleLoading(false);
            }}
          >
            {googleLoading && <Loader2 className="animate-spin mr-2" />} Sign in
            with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

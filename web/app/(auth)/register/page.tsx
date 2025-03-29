"use client";
import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Loader2, LoaderCircleIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import axios, { isAxiosError } from "axios";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const signUpUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/users/signup", {
        name,
        email,
        password,
        role,
      });
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.ok) {
        toast.success("Account created successfully");
      } else {
        toast.error(result?.error ?? "An error occurred");
      }
      setLoading(false);
      router?.push(`/dashboard`);
    } catch (err: any) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "An error occurred");
      }
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-full  px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 sm:p-8">
        <div className="text-center">
          <h2 className="sm:text-3xl text-2xl font-bold tracking-tight">
            Sign up for an account
          </h2>
          <p className="mt-4 max-sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
              prefetch={false}
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={signUpUser}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select required onValueChange={setRole} value={role}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full">
            {loading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "Sign up"
            )}
          </Button>
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

export default SignupPage;

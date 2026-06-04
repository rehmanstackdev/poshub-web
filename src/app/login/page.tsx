"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { ScanLine } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("admin@poshub.local");
  const [password, setPassword] = useState("admin123");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: res.accessToken, user: res.user }));
      toast.success("Welcome back");
      router.push("/dashboard");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Login failed";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center p-6">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70 dark:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.45 0.20 260 / 0.20), transparent 60%), radial-gradient(ellipse at bottom, oklch(0.55 0.18 235 / 0.18), transparent 60%)",
        }}
      />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <ScanLine className="h-6 w-6" />
            <span className="font-mono text-sm tracking-widest">POSHUB</span>
          </div>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Inventory & Point-of-Sale dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

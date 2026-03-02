"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OperatorRegisterForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${globalThis.location.origin}/operator/dashboard`,
          data: {
            role: "operator",
          }
        },
      });
      if (error) throw error;
      if (!data.session) {
        // Email confirmation required — session is null until user clicks the link
        setSuccessMessage(
          "Registration successful! Please check your email and click the confirmation link to activate your account."
        );
        return;
      }
      router.push("/operator/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-2xl shadow-primary/5 border-border">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-display font-bold tracking-tight text-primary">Operator Registration</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Join as an operator to manage your luxury buses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password" className="text-foreground font-semibold">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
              {successMessage && (
                <p className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
                  {successMessage}
                </p>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-display tracking-wide font-semibold shadow-md py-6 rounded-lg mt-2" disabled={isLoading || !!successMessage}>
                {isLoading ? "Registering account..." : "Register as Operator"}
              </Button>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have a operator account?{" "}
              <Link href="/operator/login" className="font-semibold text-primary underline underline-offset-4 hover:text-accent transition-colors">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

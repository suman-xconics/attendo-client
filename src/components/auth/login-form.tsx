/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { MoveRight } from "lucide-react";
import { z } from "zod";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate(); // ✅ TanStack Router navigate hook
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: true,
        },
        {
          onSuccess: async () => {
            await navigate({ to: "/" });
            toast.success("Logged in successfully!");
          },
          onError: (error) => {
            toast.error(error.error.message || "Sign-in failed.");
          },
        }
      );
    } catch (error: any) {
      toast.error(error.message || "Sign-in failed.");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      {/* Form fields remain same */}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...form.register("email")}
          className={cn({
            "border-destructive focus-visible:ring-destructive":
              !!form.formState.errors.email,
          })}
        />
        {form.formState.errors.email?.message && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <PasswordInput
          id="password"
          {...form.register("password")}
          className={cn({
            "border-destructive focus-visible:ring-destructive":
              !!form.formState.errors.password,
          })}
        />
        {form.formState.errors.password?.message && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
      </Field>

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Logging in" : "Login"}
        <MoveRight className="size-4 ml-2" />
      </Button>
    </form>
  );
}

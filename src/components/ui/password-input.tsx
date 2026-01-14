
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";


interface PasswordInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "type"> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        className={cn("pr-10", className)}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <button
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="-translate-y-1/2 absolute top-1/2 right-3 transform cursor-pointer transition-colors hover:text-secondary-foreground"
        onClick={togglePasswordVisibility}
        type="button"
      >
        {showPassword ? (
          <Eye className="h-5 w-5 text-secondary-foreground" />
        ) : (
          <EyeOff className="h-5 w-5 text-secondary-foreground" />
        )}
      </button>
    </div>
  );
}

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema } from "./schemas";
import type { loginFormInputsProps } from "./types";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader/Loader";
import { useLogin } from "../../hooks/useLogin";

export const LoginForm = () => {
  const schema = loginSchema();
  const form = useForm<loginFormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleFormLogin = (data: loginFormInputsProps) => {
    login({ email: data.username, password: data.password });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormLogin)}
        className="space-y-5 rounded-xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="username" className="text-sm font-medium">
                Email
              </FormLabel>

              <FormControl>
                <Input
                  id="username"
                  inputMode="email"
                  type="email"
                  placeholder="curador@cinedash.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoFocus
                  spellCheck={false}
                  className={
                    fieldState.error
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="password" className="text-sm font-medium">
                Senha
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    name={field.name}
                    onChange={(value) => value && field.onChange(value)}
                    ref={field.ref}
                    autoComplete="current-password"
                    spellCheck={false}
                    className={
                      fieldState.error
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    required
                  />
                  <button
                    onClick={handleTogglePasswordVisibility}
                    type="button"
                    className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-xs text-center text-destructive pt-1">
            {error.message}
          </p>
        )}

        <Button
          className="w-full cursor-pointer"
          size="lg"
          disabled={isPending}
          type="submit"
        >
          {isPending ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
          Entrar
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Demo · processo Inbazz
        </p>
      </form>
    </Form>
  );
};

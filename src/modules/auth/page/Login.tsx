import { Film } from "lucide-react";
import { LoginForm } from "../components/login-form/LoginForm";

const Login = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,oklch(0.78_0.13_85_/_0.15),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.78_0.13_85_/_0.08),transparent_50%)]" />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-gold)]">
            <Film className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Cine<span className="text-primary">Dash</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Curadoria de cinema, em alto contraste.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

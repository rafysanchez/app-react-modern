import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const { setUser, setError } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoginError(null);
      const { user } = await authService.login(data.email, data.password);
      setUser(user);
      navigate("/products");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during login.",
      );
      setLoginError(
        error.response?.data?.message || "An error occurred during login.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;

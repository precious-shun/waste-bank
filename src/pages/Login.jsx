import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const inputStyle = {
  ":hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.darkGreen,
  },
  ":hover .MuiInputLabel-outlined ": {
    color: theme.darkGreen,
  },
  ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.orange,
  },
  ".MuiInputLabel-root.Mui-focused": {
    color: theme.orange,
  },
};

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      setError("");
      setIsLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      setError("Failed to sign in: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.darkGreen }}
      className="flex justify-center items-center h-screen"
    >
      <div className="flex w-4/5 items-center justify-center space-x-10">
        <div className="w-1/2 flex justify-center">
          <img src={Logo} alt="Logo" className="w-144" />
        </div>
        <div className="w-1/3">
          <Card
            variant="outlined"
            style={{ backgroundColor: theme.lightGrey }}
            sx={{ borderRadius: 4 }}
            className="w-96 px-1.5 py-2"
          >
            <CardContent>
              <Typography
                className="text-center text-2xl font-semibold mb-6"
                style={{ color: theme.darkGreen }}
              >
                Login
              </Typography>
              <Typography
                className="text-center mb-6"
                style={{ color: theme.darkGreen }}
              >
                Input your email and password
              </Typography>
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <div className="space-y-4">
                  <TextField
                    sx={inputStyle}
                    fullWidth
                    label="Email"
                    variant="outlined"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <TextField
                    sx={inputStyle}
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />

                  {error && (
                    <Typography color="error" className="text-sm">
                      {error}
                    </Typography>
                  )}
                </div>

                <Button
                  size="large"
                  sx={{ backgroundColor: theme.green }}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Loading" : "Login"}
                </Button>
              </form>
              <Divider sx={{ my: 3 }} />
              <Typography
                className="text-center"
                style={{ color: theme.darkGreen }}
              >
                Don't have an account yet?
              </Typography>
              <Button
                size="large"
                sx={{ backgroundColor: theme.orange, mt: 2 }}
                variant="contained"
                fullWidth
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

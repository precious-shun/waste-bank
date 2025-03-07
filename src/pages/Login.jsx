import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { theme } from "../theme";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

const inputStyle = {
  ":hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.darkGreen,
  },
  ":hover .MuiInputLabel-outlined ": {
    color: theme.darkGreen,
  },
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User role:", userData.role);

        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.lightGrey }}
      className="flex justify-center items-center h-screen"
    >
      <Card
        variant="outlined"
        style={{ backgroundColor: theme.lightGreen }}
        sx={{ borderRadius: 4 }}
        className="w-96 px-1.5 py-2"
      >
        <CardContent>
          <p
            style={{ color: theme.darkGreen }}
            className="text-center text-2xl font-semibold mb-6"
          >
            Login
          </p>
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
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

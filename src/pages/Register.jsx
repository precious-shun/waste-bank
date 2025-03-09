import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
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

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: "",
    },
  });

  const handleRegister = async (data) => {
    try {
      setError("");
      setIsLoading(true);

      const userCredential = await signup(data.email, data.password);
      await setDoc(doc(db, "users", userCredential.uid), {
        email: data.email,
        fullname: data.fullname,
        gender: data.gender,
        address: data.address,
        balance: 0,
        role: "client",
      });
      alert("User created successfully");
    } catch (error) {
      setError("Failed to create an account: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.darkGreen }}
      className="flex justify-center items-center h-screen"
    >
      <div className="flex flex-col lg:w-4/5 md:flex-row items-center justify-center lg:space-x-10">
        <div className="sm:w-1/2 flex justify-center">
          <img src={Logo} alt="Logo" className="w-64 md:w-auto" />
        </div>
        <div className="lg:w-1/3">
          <Card
            variant="outlined"
            sx={{ borderRadius: 4 }}
            style={{ backgroundColor: theme.lightGrey }}
            className="sm:w-96 px-1.5 mx-4"
          >
            <CardContent>
              <Typography
                className="text-center text-2xl font-semibold mb-6"
                style={{
                  color: theme.darkGreen,
                  fontSize: 30,
                  fontWeight: 600,
                }}
              >
                Register
              </Typography>
              <Typography
                className="text-center mb-6"
                style={{ color: theme.darkGreen, marginBottom: 20 }}
              >
                Please fill in your data
              </Typography>
              <form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
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
                  <TextField
                    sx={inputStyle}
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    {...register("fullname")}
                    error={!!errors.fullname}
                    helperText={errors.fullname?.message}
                  />
                  <FormControl
                    fullWidth
                    error={!!errors.gender}
                    variant="outlined"
                    sx={inputStyle}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select labelId="gender-label" {...register("gender")}>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {errors.gender && (
                      <FormHelperText>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                </div>
                <TextField
                  sx={inputStyle}
                  fullWidth
                  label="Address"
                  variant="outlined"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
                <Button
                  size="large"
                  sx={{ backgroundColor: theme.green, borderRadius: "10px" }}
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                >
                  Register
                </Button>
              </form>
              <Divider sx={{ my: 3 }} />
              <Typography
                className="text-center"
                style={{ color: theme.darkGreen }}
              >
                Already have an account?
              </Typography>
              <Button
                size="large"
                sx={{
                  backgroundColor: theme.orange,
                  mt: 2,
                  borderRadius: "10px",
                }}
                variant="contained"
                fullWidth
                onClick={() => navigate("/")}
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;

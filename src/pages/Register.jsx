import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
  fullname: z.string().nonempty("Fullname is required"),
  gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
  address: z.string().nonempty("Address is required"),
});

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

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullname: data.fullname,
        gender: data.gender,
        address: data.address,
        balance: 0,
        role: "client",
      });

      alert("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error.message);
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
            sx={{ borderRadius: 4 }}
            style={{ backgroundColor: theme.lightGrey }}
            className="w-96 px-1.5"
          >
            <CardContent>
              <p
                style={{ color: theme.darkGreen }}
                className="text-center text-2xl font-semibold mb-6"
              >
                Register
                <Typography
                  className="text-center mb-6"
                  style={{ color: theme.darkGreen }}
                >
                  Please fill in your data
                </Typography>
              </p>
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
                  <TextField
                    sx={inputStyle}
                    fullWidth
                    select
                    label="Gender"
                    variant="outlined"
                    {...register("gender")}
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
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
                  sx={{ backgroundColor: theme.green }}
                  type="submit"
                  variant="contained"
                  fullWidth
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
                sx={{ backgroundColor: theme.orange, mt: 2 }}
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

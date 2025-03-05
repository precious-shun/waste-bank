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
  Typography,
  MenuItem,
} from "@mui/material";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
  fullname: z.string().nonempty("Fullname is required"),
  gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
  address: z.string().nonempty("Address is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardContent>
          <Typography variant="h5" className="text-center mb-4">
            Register
          </Typography>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              {...register("fullname")}
              error={!!errors.fullname}
              helperText={errors.fullname?.message}
            />

            <TextField
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

            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

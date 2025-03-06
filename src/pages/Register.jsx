import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { TextField, Button, Card, CardContent, MenuItem } from "@mui/material";
import { theme } from "../theme";

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
};

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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
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
    <div style={{ backgroundColor: theme.lightGrey }} className="flex justify-center items-center h-screen">
      <Card variant="outlined" sx={{ borderRadius: 4 }} style={{ backgroundColor: theme.lightGreen }} className="w-96 px-1.5">
        <CardContent>
          <p style={{ color: theme.darkGreen }} className="text-center text-2xl font-semibold mb-6">
            Register
          </p>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
            <div className="space-y-4">
              <TextField sx={inputStyle} fullWidth label="Email" variant="outlined" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />

              <TextField sx={inputStyle} fullWidth label="Password" type="password" variant="outlined" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />

              <TextField sx={inputStyle} fullWidth label="Full Name" variant="outlined" {...register("fullname")} error={!!errors.fullname} helperText={errors.fullname?.message} />

              <TextField sx={inputStyle} fullWidth select label="Gender" variant="outlined" {...register("gender")} error={!!errors.gender} helperText={errors.gender?.message}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>

              <TextField sx={inputStyle} fullWidth label="Address" variant="outlined" {...register("address")} error={!!errors.address} helperText={errors.address?.message} />
            </div>
            <Button size="large" sx={{ backgroundColor: theme.green }} type="submit" variant="contained" fullWidth>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

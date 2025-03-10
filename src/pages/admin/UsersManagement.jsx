import Sidebar from "../../components/Sidebar";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ManagementTable from "../../components/common/ManagementTable";
import ManagementHeader from "../../components/common/ManagementHeader";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { userSchema } from "../../schemas/UserSchema";
import { boxStyle, theme } from "../../utils/styles";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullname: "",
      address: "",
      email: "",
      balance: 0,
      gender: "male",
    },
  });

  const getUserBalance = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("user_id", "==", userRef));
      const querySnapshot = await getDocs(q);
      let totalBalance = 0;
      querySnapshot.forEach((doc) => {
        totalBalance += doc.data().total;
      });
      return totalBalance;
    } catch (error) {
      toast.error("Error fetching user balance");
      return 0;
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = await Promise.all(
        usersSnapshot.docs.map(async (userDoc) => {
          const user = { ...userDoc.data(), id: userDoc.id };
          user.balance = await getUserBalance(user.id);
          return user;
        })
      );
      setUsers(usersData);
    } catch (error) {
      toast.error("Error fetching users data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditButton = (user) => {
    setEditingUser(user);
    setValue("fullname", user.fullname);
    setValue("address", user.address);
    setValue("email", user.email);
    setValue("balance", user.balance);
    setValue("gender", user.gender);
    setOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      await updateDoc(doc(db, "users", editingUser.id), data);
      toast.success("Success updating user");
      setOpen(false);
      setEditingUser(null);
      reset();
      fetchData();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", deleteTarget.id));
      toast.success("Success deleting user");
      setDeleteTarget(null);
      setConfirmModal(false);
      fetchData();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const confirmOpen = () => setConfirmModal(true);
  const confirmClose = () => setConfirmModal(false);

  const filteredUsers = users.filter((user) =>
    search === ""
      ? user
      : user.fullname &&
        user.fullname.toLowerCase().includes(search.toLowerCase())
  );

  const tableHeader = ["Name", "Address", "Email", "Balance", "Gender", "Role"];
  const tableCell = [
    (row) => row.fullname,
    (row) => row.address,
    (row) => row.email,
    (row) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(row.balance),
    (row) => row.gender,
    (row) => row.role || "-",
  ];
  const tableActions = {
    onDelete: (row) => {
      setDeleteTarget(row);
      confirmOpen();
    },
    onEdit: (row) => handleEditButton(row),
  };

  return (
    <>
      <div
        style={{ backgroundColor: theme.lightGrey }}
        className="px-4 md:px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-full overflow-auto">
          <ManagementHeader
            title="Users"
            searchQuery={search}
            onSearchChange={(value) => setSearch(value)}
          />
          <ManagementTable
            data={filteredUsers}
            header={tableHeader}
            cell={tableCell}
            actions={tableActions}
            loading={isLoading}
            emptyMessage="User not found"
            containerSx={{ height: "70vh" }}
          />
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingUser(null);
          reset();
        }}
        aria-labelledby="modal-edit-user-title"
        aria-describedby="modal-edit-user-description"
      >
        <Box sx={boxStyle}>
          <Typography variant="h5" className="text-center font-bold mb-4">
            Edit User
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                size="small"
                label="Name"
                variant="filled"
                {...register("fullname")}
                error={Boolean(errors.fullname)}
                helperText={errors.fullname?.message}
              />
              <TextField
                fullWidth
                size="small"
                label="Address"
                variant="filled"
                {...register("address")}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
              />
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                variant="filled"
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                size="small"
                label="Balance"
                type="number"
                variant="filled"
                {...register("balance", { valueAsNumber: true })}
                error={Boolean(errors.balance)}
                helperText={errors.balance?.message}
              />
              <TextField
                fullWidth
                size="small"
                select
                label="Gender"
                variant="filled"
                {...register("gender")}
                error={Boolean(errors.gender)}
                helperText={errors.gender?.message}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </div>
            <div className="mt-8">
              <Button
                type="submit"
                style={{ backgroundColor: theme.green }}
                size="large"
                fullWidth
                variant="contained"
              >
                Update
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <DeleteConfirmationModal
        isOpen={confirmModal}
        onClose={confirmClose}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default UsersManagement;

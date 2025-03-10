import Sidebar from "../../components/Sidebar";

import { Box, Button, Modal, TextField } from "@mui/material";

import { db } from "../../services/firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { theme, boxStyle } from "../../utils/styles";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import ManagementHeader from "../../components/common/ManagementHeader";
import { formatCurrency } from "../../utils/formatCurrency";
import ManagementTable from "../../components/common/ManagementTable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wasteSchema } from "../../schemas/WasteSchema";

const WasteManagement = () => {
  const [editingWaste, setEditingWaste] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wastes, setWastes] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(wasteSchema),
    defaultValues: {
      waste: "",
      unit: "",
      price: 0,
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingWaste(null);
    reset();
  };
  const confirmOpen = () => setConfirmModal(true);
  const confirmClose = () => setConfirmModal(false);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      price: Number(data.price),
    };

    if (editingWaste) {
      try {
        const wasteRef = doc(db, "waste-products", editingWaste.id);
        await updateDoc(wasteRef, formData);
        setWastes((prev) =>
          prev.map((item) =>
            item.id === editingWaste.id ? { ...item, ...formData } : item
          )
        );
        toast.success("Success updating waste");
      } catch (error) {
        toast.error("Error updating waste");
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "waste-products"), formData);
        setWastes([...wastes, { ...formData, id: docRef.id }]);
        toast.success("Success adding waste");
      } catch (error) {
        toast.error("Error adding waste");
      }
    }
    handleClose();
  };

  const handleEdit = (wasteItem) => {
    setEditingWaste(wasteItem);

    setValue("waste", wasteItem.waste);
    setValue("unit", wasteItem.unit);
    setValue("price", wasteItem.price);
    handleOpen();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, "waste-products", deleteTarget.id));
      setWastes((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      confirmClose();
      toast.success("Success deleting waste");
    } catch (error) {
      toast.error("Error deleting waste");
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "waste-products"));
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setWastes(data);
    } catch (error) {
      toast.error("Error fetching waste products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredWastes = wastes.filter((item) =>
    item.waste.toLowerCase().includes(searchQuery)
  );

  const tableHeader = ["Waste", "Unit", "Price"];
  const tableCell = [
    (row) => row.waste,
    (row) => row.unit,
    (row) => formatCurrency(row.price),
  ];
  const tableActions = {
    onDelete: (row) => {
      setDeleteTarget(row);
      confirmOpen();
    },
    onEdit: (row) => handleEdit(row),
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#EBEBEB" }}
        className="px-4 md:px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-full overflow-auto">
          <ManagementHeader
            title="Waste Products"
            onAddClick={handleOpen}
            searchQuery={searchQuery}
            onSearchChange={(value) => setSearchQuery(value.toLowerCase())}
          />
          <ManagementTable
            data={filteredWastes}
            header={tableHeader}
            cell={tableCell}
            actions={tableActions}
            loading={isLoading}
            emptyMessage="No waste products found"
            containerSx={{ height: "70vh" }}
          />
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <div className="text-2xl font-semibold mb-6">
            {editingWaste ? "Edit Waste" : "Add Waste Category"}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                size="small"
                label="Waste Name"
                variant="filled"
                {...register("waste")}
                error={Boolean(errors.waste)}
                helperText={errors.waste?.message}
              />
              <TextField
                fullWidth
                size="small"
                label="Unit"
                variant="filled"
                {...register("unit")}
                error={Boolean(errors.unit)}
                helperText={errors.unit?.message}
              />
              <TextField
                fullWidth
                size="small"
                label="Price"
                type="number"
                variant="filled"
                {...register("price", { valueAsNumber: true })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </div>
            <div className="mt-8">
              <Button
                style={{ backgroundColor: theme.green }}
                size="large"
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
              >
                {editingWaste ? "Update" : "Add"}
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

export default WasteManagement;

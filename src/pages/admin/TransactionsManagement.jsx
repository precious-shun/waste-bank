import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from "../../components/Sidebar";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  Autocomplete,
} from "@mui/material";

import { db } from "../../services/firebase";

import {
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ManagementHeader from "../../components/common/ManagementHeader";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import ManagementTable from "../../components/common/ManagementTable";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { TransactionSchema } from "../../schemas/TransactionSchema";
import { boxStyle, theme } from "../../utils/styles";

const TransactionDetailModal = ({
  isOpen,
  onClose,
  transaction,
  wasteProducts,
}) => {
  if (!transaction) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="transaction-detail-title"
    >
      <Box sx={boxStyle}>
        <Typography
          id="transaction-detail-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Transaction Detail
        </Typography>

        <div className="mb-4">
          <Typography variant="subtitle1">
            <strong>Date:</strong>{" "}
            {transaction.date?.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography variant="subtitle1">
            <strong>User:</strong> {transaction.user?.fullname}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Total:</strong> {formatCurrency(transaction.total || 0)}
          </Typography>
        </div>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Waste Products
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Waste</b>
                </TableCell>
                <TableCell>
                  <b>Quantity</b>
                </TableCell>
                <TableCell>
                  <b>Price</b>
                </TableCell>
                <TableCell>
                  <b>Subtotal</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transaction.waste_products &&
                transaction.waste_products.map((item, idx) => {
                  const wasteProductId = item.waste_product_id?.id;
                  const wasteProduct = wasteProducts.find(
                    (wp) => wp.id === wasteProductId
                  );

                  return (
                    <TableRow key={idx}>
                      <TableCell>{wasteProduct?.waste || "-"}</TableCell>
                      <TableCell>
                        {item.quantity} {wasteProduct?.unit || ""}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(wasteProduct?.price || 0)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.subtotal || 0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ textAlign: "right" }}>
          Total: {formatCurrency(transaction.total || 0)}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, backgroundColor: theme.green }}
          onClick={onClose}
          fullWidth
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const TransactionFormItem = ({
  index,
  control,
  wasteProducts,
  errors,
  onRemove,
  canRemove,
  register,
  setValue,
  getValues,
  watch,
}) => {
  const currentProduct = watch(`transactionItems.${index}.waste_product_id`);
  const currentQuantity = watch(`transactionItems.${index}.quantity`);

  useEffect(() => {
    if (currentProduct && currentQuantity) {
      const subtotal = currentProduct.price * parseInt(currentQuantity);
      setValue(`transactionItems.${index}.subtotal`, subtotal);
    }
  }, [currentProduct, currentQuantity, setValue, index]);

  return (
    <div className="flex gap-2 mb-3 items-center">
      <Controller
        name={`transactionItems.${index}.waste_product_id`}
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={wasteProducts}
            getOptionLabel={(option) => option?.waste || ""}
            value={field.value}
            onChange={(_, newValue) => field.onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Waste Product"
                variant="filled"
                size="small"
                fullWidth
                error={!!errors?.transactionItems?.[index]?.waste_product_id}
                helperText={
                  errors?.transactionItems?.[index]?.waste_product_id?.message
                }
              />
            )}
            sx={{ flex: 3 }}
          />
        )}
      />

      <Controller
        name={`transactionItems.${index}.quantity`}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Qty"
            variant="filled"
            size="small"
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ flex: 1 }}
            error={!!errors?.transactionItems?.[index]?.quantity}
            helperText={errors?.transactionItems?.[index]?.quantity?.message}
          />
        )}
      />

      <Typography sx={{ flex: 1.5 }}>
        {formatCurrency(getValues(`transactionItems.${index}.subtotal`) || 0)}
      </Typography>

      <IconButton
        color="error"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        <DeleteIcon className="size-5" />
      </IconButton>
    </div>
  );
};

const TransactionFormModal = ({
  isOpen,
  onClose,
  initialData,
  users,
  wasteProducts,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      transactionDate: new Date().toISOString().split("T")[0],
      selectedUser: null,
      transactionItems: [{ waste_product_id: null, quantity: 1, subtotal: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactionItems",
  });

  const transactionItems = watch("transactionItems");
  const transactionTotal = transactionItems.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        transactionDate: new Date().toISOString().split("T")[0],
        selectedUser: null,
        transactionItems: [
          { waste_product_id: null, quantity: 1, subtotal: 0 },
        ],
      });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (initialData) {
      const user = users.find((u) => u.id === initialData.user?.id);
      const transactionDateObj = initialData.date || new Date();
      const formattedDate = transactionDateObj.toISOString().split("T")[0];

      let items = [{ waste_product_id: null, quantity: 1, subtotal: 0 }];

      if (initialData.waste_products && initialData.waste_products.length > 0) {
        items = initialData.waste_products.map((item) => {
          const wasteProductId = item.waste_product_id?.id;
          const wasteProduct = wasteProducts.find(
            (wp) => wp.id === wasteProductId
          );
          return {
            waste_product_id: wasteProduct || null,
            quantity: item.quantity || 1,
            subtotal: item.subtotal || 0,
          };
        });
      }

      reset({
        transactionDate: formattedDate,
        selectedUser: user || null,
        transactionItems: items,
      });
    } else {
      reset({
        transactionDate: new Date().toISOString().split("T")[0],
        selectedUser: null,
        transactionItems: [
          { waste_product_id: null, quantity: 1, subtotal: 0 },
        ],
      });
    }
  }, [initialData, reset, users, wasteProducts]);

  const addWasteProductItem = () => {
    append({ waste_product_id: null, quantity: 1, subtotal: 0 });
  };

  const removeWasteProductItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const submitHandler = (data) => {
    onSubmit({
      ...data,
      transactionTotal,
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="transaction-form-title"
    >
      <Box sx={boxStyle}>
        <Typography
          id="transaction-form-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          {initialData ? "Edit Transaction" : "Add New Transaction"}
        </Typography>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-col gap-4 mb-4">
            <Controller
              name="transactionDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Transaction Date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  variant="filled"
                  size="small"
                  error={!!errors.transactionDate}
                  helperText={errors.transactionDate?.message}
                />
              )}
            />

            <Controller
              name="selectedUser"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option?.fullname || ""}
                  value={field.value}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select User"
                      variant="filled"
                      fullWidth
                      size="small"
                      error={!!errors.selectedUser}
                      helperText={errors.selectedUser?.message}
                    />
                  )}
                />
              )}
            />
          </div>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Waste Products
          </Typography>

          {fields.map((field, index) => (
            <TransactionFormItem
              key={field.id}
              index={index}
              control={control}
              wasteProducts={wasteProducts}
              errors={errors}
              onRemove={removeWasteProductItem}
              canRemove={fields.length > 1}
              register={register}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
            />
          ))}

          {errors.transactionItems && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.transactionItems.message}
            </Typography>
          )}

          <Button
            variant="outlined"
            startIcon={<PlusIcon className="size-5" />}
            onClick={addWasteProductItem}
            fullWidth
            sx={{ mb: 3, mt: 1 }}
          >
            Add Item
          </Button>

          <Typography variant="h6" sx={{ textAlign: "right", mb: 3 }}>
            Total: {formatCurrency(transactionTotal)}
          </Typography>

          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: theme.green }}
            fullWidth
          >
            {initialData ? "Update Transaction" : "Create Transaction"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const TransactionsManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [wasteProducts, setWasteProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [formModalState, setFormModalState] = useState({
    isOpen: false,
    currentTransaction: null,
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    currentTransaction: null,
  });

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    transactionToDelete: null,
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const transactionsSnapshot = await getDocs(
        collection(db, "transactions")
      );
      const transactionsData = [];

      for (const docSnapshot of transactionsSnapshot.docs) {
        const transaction = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };

        if (transaction.date) {
          transaction.date = transaction.date.toDate();
        }

        if (transaction.user_id) {
          const userDoc = await getDoc(transaction.user_id);
          if (userDoc.exists()) {
            transaction.user = userDoc.data();
            transaction.user.id = userDoc.id;
          }
        }

        transactionsData.push(transaction);
      }

      setTransactions(transactionsData);
    } catch (error) {
      toast.error("Error fetching transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWasteProducts = async () => {
    try {
      const wasteProductsSnapshot = await getDocs(
        collection(db, "waste-products")
      );
      const wasteProductsData = wasteProductsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWasteProducts(wasteProductsData);
    } catch (error) {
      toast.error("Error fetching waste products");
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const handleViewDetail = (transaction) => {
    setDetailModalState({
      isOpen: true,
      currentTransaction: transaction,
    });
  };

  const handleCloseDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      currentTransaction: null,
    });
  };

  const handleAddClick = () => {
    setFormModalState({
      isOpen: true,
      currentTransaction: null,
    });
  };

  const handleEditClick = (transaction) => {
    setFormModalState({
      isOpen: true,
      currentTransaction: transaction,
    });
  };

  const handleCloseFormModal = () => {
    setFormModalState({
      isOpen: false,
      currentTransaction: null,
    });
  };

  const handleDeleteClick = (transaction) => {
    setDeleteModalState({
      isOpen: true,
      transactionToDelete: transaction,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      transactionToDelete: null,
    });
  };

  const handleSubmitTransaction = async (formData) => {
    const {
      selectedUser,
      transactionItems,
      transactionDate,
      transactionTotal,
    } = formData;

    try {
      const transactionData = {
        date: Timestamp.fromDate(new Date(transactionDate)),
        user_id: doc(db, "users", selectedUser.id),
        total: transactionTotal,
        waste_products: transactionItems.map((item) => ({
          waste_product_id: doc(db, "waste-products", item.waste_product_id.id),
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      };

      if (formModalState.currentTransaction) {
        await updateDoc(
          doc(db, "transactions", formModalState.currentTransaction.id),
          transactionData
        );
      } else {
        await addDoc(collection(db, "transactions"), transactionData);
      }

      handleCloseFormModal();
      fetchTransactions();
      toast.success("Success saving transaction");
    } catch (error) {
      toast.error("Error saving transaction");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.transactionToDelete) return;

    try {
      await deleteDoc(
        doc(db, "transactions", deleteModalState.transactionToDelete.id)
      );

      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (item) => item.id !== deleteModalState.transactionToDelete.id
        )
      );

      handleCloseDeleteModal();
      toast.success("Suscces deleting transaction");
    } catch (error) {
      toast.error("Error deleting transaction");
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user &&
      transaction.user.fullname &&
      transaction.user.fullname
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchTransactions();
    fetchWasteProducts();
    fetchUsers();
  }, []);

  return (
    <>
      <div
        style={{ backgroundColor: "#EBEBEB" }}
        className="px-4 md:px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-full overflow-auto">
          <ManagementHeader
            title="Transaction"
            onAddClick={handleAddClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ManagementTable
            data={filteredTransactions}
            header={["Date", "User", "Total"]}
            cell={[
              (row) => formatDate(row.date),
              (row) => row.user?.fullname,
              (row) => formatCurrency(row.total),
            ]}
            actions={{
              onView: handleViewDetail,
              onEdit: handleEditClick,
              onDelete: handleDeleteClick,
            }}
            loading={isLoading}
            emptyMessage="No transactions found"
            containerSx={{ height: "70vh" }}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <TransactionDetailModal
        isOpen={detailModalState.isOpen}
        onClose={handleCloseDetailModal}
        transaction={detailModalState.currentTransaction}
        wasteProducts={wasteProducts}
      />

      <TransactionFormModal
        isOpen={formModalState.isOpen}
        onClose={handleCloseFormModal}
        initialData={formModalState.currentTransaction}
        users={users}
        wasteProducts={wasteProducts}
        onSubmit={handleSubmitTransaction}
      />
    </>
  );
};

export default TransactionsManagement;

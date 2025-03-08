import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from "../../components/Sidebar";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Autocomplete,
} from "@mui/material";

import { db } from "../../firebase";

import {
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const theme = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

const formatCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const TransactionHeader = ({ onAddClick, searchQuery, onSearchChange }) => {
  return (
    <>
      <div className="text-2xl font-bold mb-4 text-green-900">Transactions</div>
      <div className="mb-6 flex flex-row gap-4">
        <Button
          onClick={onAddClick}
          sx={{
            backgroundColor: theme.green,
            borderRadius: 100,
            width: 280,
            textTransform: "none",
          }}
          startIcon={<UserPlusIcon className="size-5" />}
          variant="contained"
        >
          Add Transaction
        </Button>
        <Paper elevation="0" sx={{ borderRadius: 100, width: "100%" }}>
          <TextField
            fullWidth
            placeholder="Search by user name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <MagnifyingGlassIcon
                    style={{ color: theme.orange }}
                    className="size-5 mr-2"
                  />
                ),
              },
            }}
            sx={{
              "& fieldset": { borderRadius: 100 },
              input: { "&::placeholder": { color: theme.orange } },
            }}
            size="small"
          />
        </Paper>
      </div>
    </>
  );
};

const TransactionTable = ({
  isLoading,
  transactions,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer
      elevation="0"
      sx={{
        backgroundColor: theme.lightGreen,
        height: "80%",
        borderRadius: "20px",
      }}
      component={Paper}
    >
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        aria-label="transactions table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: theme.lightGreen }}>
              <b>Date</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: theme.lightGreen }}>
              <b>User</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: theme.lightGreen }}>
              <b>Total</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: theme.lightGreen }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  {transaction.date
                    ? transaction.date.toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell>{transaction.user?.fullname || "-"}</TableCell>
                <TableCell>
                  {formatCurrency.format(transaction.total || 0)}
                </TableCell>
                <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={() => onDelete(transaction)}
                    sx={{
                      backgroundColor: theme.green,
                      borderRadius: 100,
                      height: 34,
                      textTransform: "none",
                    }}
                    variant="contained"
                  >
                    <TrashIcon className="size-5" />
                    <span className="ms-1.5 mt-0.5">Delete</span>
                  </Button>
                  <Button
                    onClick={() => onEdit(transaction)}
                    sx={{
                      backgroundColor: theme.green,
                      borderRadius: 100,
                      height: 34,
                      textTransform: "none",
                    }}
                    variant="contained"
                  >
                    <PencilSquareIcon className="size-5" />
                    <span className="ms-1.5 mt-0.5">Edit</span>
                  </Button>
                  <Button
                    onClick={() => onView(transaction)}
                    sx={{
                      backgroundColor: theme.green,
                      borderRadius: 100,
                      height: 34,
                      textTransform: "none",
                    }}
                    variant="contained"
                  >
                    <EyeIcon className="size-5" />
                    <span className="ms-1.5 mt-0.5">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
    >
      <Box sx={boxStyle}>
        <Typography id="delete-confirmation-title" variant="h6" component="h2">
          Are you sure you want to delete this transaction?
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2, mr: 2, backgroundColor: theme.darkGreen }}
          onClick={onConfirm}
        >
          Yes
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          No
        </Button>
      </Box>
    </Modal>
  );
};

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
            <strong>Total:</strong>{" "}
            {formatCurrency.format(transaction.total || 0)}
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
                        {formatCurrency.format(wasteProduct?.price || 0)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency.format(item.subtotal || 0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ textAlign: "right" }}>
          Total: {formatCurrency.format(transaction.total || 0)}
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

const TransactionSchema = z.object({
  transactionDate: z.string().nonempty("Date is required"),
  selectedUser: z
    .object({
      id: z.string(),
      fullname: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "User is required",
    }),
  transactionItems: z
    .array(
      z.object({
        waste_product_id: z
          .object({
            id: z.string(),
            waste: z.string(),
            price: z.number(),
            unit: z.string().optional(),
          })
          .nullable()
          .refine((val) => val !== null, {
            message: "Product is required",
          }),
        quantity: z
          .number()
          .min(1, "Quantity must be at least 1")
          .or(z.string().transform((val) => parseInt(val) || 0)),
        subtotal: z.number().optional(),
      })
    )
    .min(1, "At least one product is required"),
});

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
        {formatCurrency.format(
          getValues(`transactionItems.${index}.subtotal`) || 0
        )}
      </Typography>

      <IconButton
        color="error"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        <MinusIcon className="size-5" />
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
            Total: {formatCurrency.format(transactionTotal)}
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
      console.error("Error fetching transactions:", error);
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
      console.error("Error fetching waste products:", error);
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
      console.error("Error fetching users:", error);
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
    } catch (error) {
      console.error("Error saving transaction:", error);
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
    } catch (error) {
      console.error("Error deleting transaction:", error);
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
        className="px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-screen">
          <TransactionHeader
            onAddClick={handleAddClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <TransactionTable
            isLoading={isLoading}
            transactions={filteredTransactions}
            onView={handleViewDetail}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
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

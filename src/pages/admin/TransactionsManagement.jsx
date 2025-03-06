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

const THEME = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const MODAL_STYLE = {
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
            backgroundColor: THEME.green,
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
                    style={{ color: THEME.orange }}
                    className="size-5 mr-2"
                  />
                ),
              },
            }}
            sx={{
              "& fieldset": { borderRadius: 100 },
              input: { "&::placeholder": { color: THEME.orange } },
            }}
            size="small"
          />
        </Paper>
      </div>
    </>
  );
};

const TransactionTable = ({ transactions, onView, onEdit, onDelete }) => {
  return (
    <TableContainer
      elevation="0"
      sx={{ backgroundColor: THEME.lightGreen, height: "80%" }}
      component={Paper}
    >
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        aria-label="transactions table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: THEME.lightGreen }}>
              <b>Date</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: THEME.lightGreen }}>
              <b>User</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: THEME.lightGreen }}>
              <b>Total</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: THEME.lightGreen }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
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
                    backgroundColor: THEME.green,
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
                    backgroundColor: THEME.green,
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
                    backgroundColor: THEME.green,
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
    >
      <Box sx={MODAL_STYLE}>
        <Typography id="delete-confirmation-title" variant="h6" component="h2">
          Are you sure you want to delete this transaction?
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2, mr: 2, backgroundColor: THEME.darkGreen }}
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
  open,
  onClose,
  transaction,
  wasteProducts,
}) => {
  if (!transaction) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="transaction-detail-title"
    >
      <Box sx={MODAL_STYLE}>
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
          sx={{ mt: 3, backgroundColor: THEME.green }}
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
  item,
  index,
  wasteProducts,
  onProductChange,
  onQuantityChange,
  onRemove,
  canRemove,
}) => {
  return (
    <div className="flex gap-2 mb-3 items-center">
      <Autocomplete
        options={wasteProducts}
        getOptionLabel={(option) => option.waste || ""}
        value={item.waste_product_id}
        onChange={(e, newValue) => onProductChange(index, newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Waste Product"
            variant="filled"
            size="small"
            fullWidth
          />
        )}
        sx={{ flex: 3 }}
      />

      <TextField
        label="Qty"
        variant="filled"
        size="small"
        type="number"
        value={item.quantity}
        onChange={(e) => onQuantityChange(index, e.target.value)}
        InputProps={{ inputProps: { min: 1 } }}
        sx={{ flex: 1 }}
      />

      <Typography sx={{ flex: 1.5 }}>
        {formatCurrency.format(item.subtotal)}
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
  open,
  onClose,
  transaction,
  users,
  wasteProducts,
  onSave,
  formData,
  setFormData,
}) => {
  const { selectedUser, transactionItems, transactionDate, transactionTotal } =
    formData;

  const handleUserChange = (event, newValue) => {
    setFormData({ ...formData, selectedUser: newValue });
  };

  const handleWasteProductChange = (index, newValue) => {
    const updatedItems = [...transactionItems];
    updatedItems[index].waste_product_id = newValue;

    if (newValue && updatedItems[index].quantity) {
      updatedItems[index].subtotal =
        newValue.price * updatedItems[index].quantity;
    } else {
      updatedItems[index].subtotal = 0;
    }

    setFormData({ ...formData, transactionItems: updatedItems });
    calculateTotal(updatedItems);
  };

  const handleQuantityChange = (index, value) => {
    const quantity = Math.max(1, parseInt(value) || 0);
    const updatedItems = [...transactionItems];
    updatedItems[index].quantity = quantity;

    if (updatedItems[index].waste_product_id) {
      updatedItems[index].subtotal =
        updatedItems[index].waste_product_id.price * quantity;
    }

    setFormData({ ...formData, transactionItems: updatedItems });
    calculateTotal(updatedItems);
  };

  const addWasteProductItem = () => {
    setFormData({
      ...formData,
      transactionItems: [
        ...transactionItems,
        { waste_product_id: null, quantity: 1, subtotal: 0 },
      ],
    });
  };

  const removeWasteProductItem = (index) => {
    if (transactionItems.length <= 1) return;

    const updatedItems = transactionItems.filter((_, i) => i !== index);
    setFormData({ ...formData, transactionItems: updatedItems });
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setFormData({ ...formData, transactionTotal: total });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="transaction-form-title"
    >
      <Box sx={MODAL_STYLE}>
        <Typography
          id="transaction-form-title"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </Typography>

        <div className="flex flex-col gap-4 mb-4">
          <TextField
            type="date"
            label="Transaction Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={transactionDate}
            onChange={(e) =>
              setFormData({ ...formData, transactionDate: e.target.value })
            }
            variant="filled"
            size="small"
          />

          <Autocomplete
            options={users}
            getOptionLabel={(option) => option.fullname || ""}
            value={selectedUser}
            onChange={handleUserChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                variant="filled"
                fullWidth
                size="small"
              />
            )}
          />
        </div>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Waste Products
        </Typography>

        {transactionItems.map((item, index) => (
          <TransactionFormItem
            key={index}
            item={item}
            index={index}
            wasteProducts={wasteProducts}
            onProductChange={handleWasteProductChange}
            onQuantityChange={handleQuantityChange}
            onRemove={removeWasteProductItem}
            canRemove={transactionItems.length > 1}
          />
        ))}

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
          variant="contained"
          sx={{ backgroundColor: THEME.green }}
          onClick={onSave}
          fullWidth
        >
          {transaction ? "Update Transaction" : "Create Transaction"}
        </Button>
      </Box>
    </Modal>
  );
};

const TransactionsManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [wasteProducts, setWasteProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    selectedUser: null,
    transactionItems: [{ waste_product_id: null, quantity: 1, subtotal: 0 }],
    transactionDate: new Date().toISOString().split("T")[0],
    transactionTotal: 0,
  });

  const fetchTransactions = async () => {
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
    setDetailTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);

    const user = users.find((u) => u.id === transaction.user?.id);

    const transactionDateObj = transaction.date || new Date();
    const formattedDate = transactionDateObj.toISOString().split("T")[0];

    let items = [{ waste_product_id: null, quantity: 1, subtotal: 0 }];

    if (transaction.waste_products && transaction.waste_products.length > 0) {
      items = transaction.waste_products.map((item) => {
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

    setFormData({
      selectedUser: user || null,
      transactionItems: items,
      transactionDate: formattedDate,
      transactionTotal: transaction.total || 0,
    });

    setFormModalOpen(true);
  };

  const handleOpenAddForm = () => {
    setFormData({
      selectedUser: null,
      transactionItems: [{ waste_product_id: null, quantity: 1, subtotal: 0 }],
      transactionDate: new Date().toISOString().split("T")[0],
      transactionTotal: 0,
    });

    setEditingTransaction(null);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setDeleteTarget(transaction);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDoc(doc(db, "transactions", deleteTarget.id));

      setTransactions((prevTransactions) =>
        prevTransactions.filter((item) => item.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleSaveTransaction = async () => {
    const {
      selectedUser,
      transactionItems,
      transactionDate,
      transactionTotal,
    } = formData;

    if (
      !selectedUser ||
      transactionItems.some((item) => !item.waste_product_id)
    ) {
      alert("Please select a user and waste products for all items");
      return;
    }

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

      if (editingTransaction) {
        await updateDoc(
          doc(db, "transactions", editingTransaction.id),
          transactionData
        );
      } else {
        await addDoc(collection(db, "transactions"), transactionData);
      }

      setFormModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error saving transaction: " + error.message);
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
          {/* Header section */}
          <TransactionHeader
            onAddClick={handleOpenAddForm}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Transaction table */}
          <TransactionTable
            transactions={filteredTransactions}
            onView={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
      />

      <TransactionDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        transaction={detailTransaction}
        wasteProducts={wasteProducts}
      />

      <TransactionFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        transaction={editingTransaction}
        users={users}
        wasteProducts={wasteProducts}
        onSave={handleSaveTransaction}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default TransactionsManagement;

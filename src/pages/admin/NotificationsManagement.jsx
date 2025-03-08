import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
} from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";

import { db } from "../../firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";

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
  overflow: "auto",
};

const notificationSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  recipients: z
    .array(z.string())
    .min(1, { message: "At least one recipient is required" }),
});

const NotificationsHeader = ({ onAddClick, searchQuery, setSearchQuery }) => {
  return (
    <>
      <div className="text-2xl font-bold mb-4 text-green-900">Notification</div>
      <div className="mb-6 flex flex-row gap-4">
        <Button
          onClick={onAddClick}
          sx={{
            backgroundColor: "#4E7972",
            borderRadius: 100,
            width: 280,
            textTransform: "none",
          }}
          startIcon={<UserPlusIcon className="size-5" />}
          variant="contained"
        >
          Add Notification
        </Button>
        <Paper elevation="0" sx={{ borderRadius: 100, width: "100%" }}>
          <TextField
            fullWidth
            placeholder="Search by date or message"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon
                    style={{ color: theme.orange }}
                    className="size-5 mr-2"
                  />
                </InputAdornment>
              ),
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

const NotificationFormModal = ({
  isOpen,
  onClose,
  users,
  onSubmit,
  initialData,
}) => {
  const [searchText, setSearchText] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      date: initialData?.date || "",
      message: initialData?.message || "",
      recipients: initialData?.recipients || [],
    },
  });

  const watchedRecipients = watch("recipients") || [];

  const filteredUsers = users.filter(
    (user) =>
      user.fullname &&
      user.fullname.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      reset({
        date: initialData?.date || "",
        message: initialData?.message || "",
        recipients: initialData?.recipients || [],
      });
    }
  }, [isOpen, initialData, reset]);

  const handleSelectAll = () => {
    if (filteredUsers.length === watchedRecipients.length) {
      setValue("recipients", []);
    } else {
      setValue(
        "recipients",
        filteredUsers.map((user) => user.id)
      );
    }
  };

  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => watchedRecipients.includes(user.id));

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="notification-modal-title"
    >
      <Box sx={boxStyle}>
        <div className="text-2xl font-semibold mb-6">
          {initialData ? "Edit Notification" : "Add Notification"}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type="date"
                  variant="filled"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />

            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type="text"
                  variant="filled"
                  label="Message"
                  multiline
                  rows={3}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
              )}
            />

            <FormControl
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.recipients}
            >
              <InputLabel id="recipients-label">Recipients</InputLabel>

              <TextField
                fullWidth
                size="small"
                variant="filled"
                placeholder="Search recipients"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlassIcon className="size-4" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2, mt: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                }
                label="Select All"
                sx={{ mb: 1 }}
              />

              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <Controller
                  name="recipients"
                  control={control}
                  render={({ field }) => (
                    <FormGroup>
                      {filteredUsers.map((user) => (
                        <FormControlLabel
                          key={user.id}
                          control={
                            <Checkbox
                              checked={field.value.includes(user.id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                if (isChecked) {
                                  field.onChange([...field.value, user.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter((id) => id !== user.id)
                                  );
                                }
                              }}
                            />
                          }
                          label={user.fullname}
                        />
                      ))}
                    </FormGroup>
                  )}
                />
              </div>

              {errors.recipients && (
                <FormHelperText>{errors.recipients.message}</FormHelperText>
              )}

              {watchedRecipients.length > 0 && (
                <Box
                  sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                >
                  <Typography variant="caption" sx={{ width: "100%", mb: 1 }}>
                    Selected ({watchedRecipients.length}):
                  </Typography>
                </Box>
              )}
            </FormControl>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              style={{ backgroundColor: theme.green }}
              size="large"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              {initialData ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

const RecipientsModal = ({ isOpen, onClose, recipients }) => {
  const [searchText, setSearchText] = useState("");

  const filteredRecipients =
    recipients?.filter((recipient) =>
      recipient.user?.fullname?.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="recipients-modal-title"
    >
      <Box sx={boxStyle}>
        <Typography
          id="recipients-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Recipients ({recipients?.length || 0})
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search recipients"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlassIcon className="size-4" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
          {filteredRecipients.length === 0 ? (
            <ListItem>
              <ListItemText primary="No recipients found" />
            </ListItem>
          ) : (
            filteredRecipients.map((recipient, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={recipient.user?.fullname || "Unknown User"}
                    secondary={recipient.is_read ? "Read" : "Unread"}
                  />
                </ListItem>
                {index < filteredRecipients.length - 1 && <Divider />}
              </div>
            ))
          )}
        </List>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: theme.green }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
    >
      <Box sx={boxStyle}>
        <Typography id="delete-confirmation-title" variant="h6" component="h2">
          Are you sure you want to delete this notification?
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

const NotificationsTable = ({
  isLoading,
  notifications,
  onEdit,
  onDelete,
  onViewRecipients,
}) => {
  return (
    <TableContainer
      elevation="0"
      sx={{ backgroundColor: "#C2D1C8", height: "80%", borderRadius: "20px" }}
      component={Paper}
    >
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        aria-label="notifications table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
              <b>Date</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
              <b>Message</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
              <b>Recipients</b>
            </TableCell>
            <TableCell sx={{ backgroundColor: "#C2D1C8" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No notifications found
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.displayDate}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => onViewRecipients(notification)}
                    sx={{
                      backgroundColor: "#4E7972",
                      borderRadius: 100,
                      height: 34,
                      textTransform: "none",
                      color: "white",
                      fontSize: "0.75rem",
                    }}
                    variant="contained"
                    startIcon={<EyeIcon className="size-4" />}
                  >
                    View {notification.formattedRecipients?.length || 0}{" "}
                    Recipients
                  </Button>
                </TableCell>
                <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={() => onDelete(notification)}
                    sx={{
                      backgroundColor: "#4E7972",
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
                    onClick={() => onEdit(notification)}
                    sx={{
                      backgroundColor: "#4E7972",
                      borderRadius: 100,
                      height: 34,
                      textTransform: "none",
                    }}
                    variant="contained"
                  >
                    <PencilSquareIcon className="size-5" />
                    <span className="ms-1.5 mt-0.5">Edit</span>
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

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [notificationModalState, setNotificationModalState] = useState({
    isOpen: false,
    currentNotification: null,
  });

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    notificationToDelete: null,
  });

  const [recipientsModalState, setRecipientsModalState] = useState({
    isOpen: false,
    recipients: null,
  });

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const formatRecipients = async (notificationData) => {
    if (
      !notificationData.recipients ||
      notificationData.recipients.length === 0
    ) {
      return [];
    }

    const recipientsPromises = notificationData.recipients.map(
      async (recipient) => {
        try {
          if (recipient.user_id && recipient.user_id.path) {
            const userDoc = await getDoc(doc(db, recipient.user_id.path));
            if (userDoc.exists()) {
              return {
                ...recipient,
                user: userDoc.data(),
                userId: userDoc.id,
              };
            }
          }
          return recipient;
        } catch (error) {
          console.error("Error fetching recipient details: ", error);
          return recipient;
        }
      }
    );

    return Promise.all(recipientsPromises);
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "notifications"));

      const notificationsPromises = querySnapshot.docs.map(
        async (docSnapshot) => {
          const notificationData = docSnapshot.data();

          const dateObj = notificationData.date?.toDate();
          const displayDate = dateObj
            ? dateObj.toLocaleDateString()
            : "Invalid date";

          const formattedRecipients = await formatRecipients(notificationData);

          return {
            id: docSnapshot.id,
            ...notificationData,
            displayDate,
            formattedRecipients,
          };
        }
      );

      const processedNotifications = await Promise.all(notificationsPromises);
      setNotifications(processedNotifications);
    } catch (error) {
      console.error("Error fetching notifications: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNotificationModalState({
      isOpen: true,
      currentNotification: null,
    });
  };

  const handleEditClick = (notification) => {
    const dateObj = notification.date?.toDate();

    const formattedDate = dateObj
      ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(dateObj.getDate()).padStart(2, "0")}`
      : "";

    const userIds = notification.formattedRecipients
      ?.map((recipient) => recipient.userId || "")
      .filter((id) => id !== "");

    setNotificationModalState({
      isOpen: true,
      currentNotification: {
        id: notification.id,
        date: formattedDate,
        message: notification.message,
        recipients: userIds,
      },
    });
  };

  const handleViewRecipients = (notification) => {
    setRecipientsModalState({
      isOpen: true,
      recipients: notification.formattedRecipients,
    });
  };

  const handleCloseNotificationModal = () => {
    setNotificationModalState({
      isOpen: false,
      currentNotification: null,
    });
  };

  const handleCloseRecipientsModal = () => {
    setRecipientsModalState({
      isOpen: false,
      recipients: null,
    });
  };

  const handleDeleteClick = (notification) => {
    setDeleteModalState({
      isOpen: true,
      notificationToDelete: notification,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      notificationToDelete: null,
    });
  };

  const handleSubmitNotification = async (formData) => {
    try {
      const dateTimestamp = Timestamp.fromDate(new Date(formData.date));

      const recipients = formData.recipients.map((userId) => ({
        is_read: false,
        user_id: doc(db, "users", userId),
      }));

      const notificationData = {
        date: dateTimestamp,
        message: formData.message,
        recipients,
      };

      if (notificationModalState.currentNotification?.id) {
        const notificationRef = doc(
          db,
          "notifications",
          notificationModalState.currentNotification.id
        );
        await updateDoc(notificationRef, notificationData);
      } else {
        await addDoc(collection(db, "notifications"), notificationData);
      }

      await fetchNotifications();
      handleCloseNotificationModal();
    } catch (error) {
      console.error(
        `Error ${notificationModalState.currentNotification ? "updating" : "adding"} notification:`,
        error
      );
      alert(
        `Failed to ${
          notificationModalState.currentNotification ? "update" : "add"
        } notification. Please try again.`
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.notificationToDelete) return;

    try {
      await deleteDoc(
        doc(db, "notifications", deleteModalState.notificationToDelete.id)
      );

      await fetchNotifications();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting notification: ", error);
      alert("Failed to delete notification. Please try again.");
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const searchLower = searchQuery.toLowerCase();
    const dateStr = notification.displayDate?.toLowerCase() || "";
    const messageStr = notification.message?.toLowerCase() || "";

    return dateStr.includes(searchLower) || messageStr.includes(searchLower);
  });

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  return (
    <>
      <div
        style={{ backgroundColor: "#EBEBEB" }}
        className="px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-screen">
          <NotificationsHeader
            onAddClick={handleAddClick}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <NotificationsTable
            isLoading={isLoading}
            notifications={filteredNotifications}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewRecipients={handleViewRecipients}
          />
        </div>
      </div>

      <NotificationFormModal
        isOpen={notificationModalState.isOpen}
        onClose={handleCloseNotificationModal}
        users={users}
        initialData={notificationModalState.currentNotification}
        onSubmit={handleSubmitNotification}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <RecipientsModal
        isOpen={recipientsModalState.isOpen}
        onClose={handleCloseRecipientsModal}
        recipients={recipientsModalState.recipients}
      />
    </>
  );
};

export default NotificationsManagement;

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Sidebar from "../../components/Sidebar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
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
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

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
import { toast } from "sonner";
import ManagementHeader from "../../components/common/ManagementHeader";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { formatDate } from "../../utils/formatDate";
import ManagementTable from "../../components/common/ManagementTable";
import { boxStyle, theme } from "../../utils/styles";
import { notificationSchema } from "../../schemas/NotificationSchema";
import { db } from "../../services/firebase";

const NotificationFormModal = ({
  isOpen,
  onClose,
  users,
  onSubmit,
  initialData,
}) => {
  const [searchText, setSearchText] = useState("");

  const formatDateForInput = (dateValue) => {
    const dateObj = dateValue?.toDate
      ? dateValue.toDate()
      : new Date(dateValue);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      date: initialData?.date
        ? formatDateForInput(initialData.date)
        : new Date().toISOString().split("T")[0],
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
        date: initialData?.date
          ? formatDateForInput(initialData.date)
          : new Date().toISOString().split("T")[0],
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
      toast.error("Error fetching users");
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
          toast.error("Error fetching recipient details");
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
      const notificationsData = [];

      for (const docSnapshot of querySnapshot.docs) {
        const notification = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };

        if (notification.date) {
          notification.date = notification.date.toDate();
        } else {
          notification.date = new Date();
        }

        notification.displayDate = formatDate(notification.date);

        notification.formattedRecipients = await formatRecipients(notification);

        notificationsData.push(notification);
      }

      setNotifications(notificationsData);
    } catch (error) {
      toast.error("Error fetching notifications");
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
    let dateObj;

    if (notification.date?.toDate) {
      dateObj = notification.date.toDate();
    } else if (notification.date instanceof Date) {
      dateObj = notification.date;
    } else if (
      typeof notification.date === "string" ||
      typeof notification.date === "number"
    ) {
      dateObj = new Date(notification.date);
    } else {
      console.error("Invalid date format:", notification.date);
      dateObj = new Date(); // Default jika tidak valid
    }

    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

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
      toast.error(
        `Error ${notificationModalState.currentNotification ? "updating" : "adding"} notification:`
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
      toast.success("Success deleting notification");
    } catch (error) {
      toast.error("Failed to delete notification. Please try again");
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
        style={{ backgroundColor: theme.lightGrey }}
        className="px-4 md:px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-full overflow-auto">
          <ManagementHeader
            title="Notifications"
            onAddClick={handleAddClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ManagementTable
            data={filteredNotifications}
            header={["Date", "Message"]}
            cell={[(row) => formatDate(row.date), (row) => row.message]}
            actions={{
              onView: handleViewRecipients,
              onEdit: handleEditClick,
              onDelete: handleDeleteClick,
            }}
            loading={isLoading}
            emptyMessage="No notifications found"
            containerSx={{ height: "70vh" }}
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

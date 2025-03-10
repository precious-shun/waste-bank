import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BellIcon } from "@heroicons/react/24/solid";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const now = new Date();

    const notificationsRef = collection(db, "notifications");

    const q = query(
      notificationsRef,
      where("date", ">=", oneMonthAgo),
      where("date", "<=", now),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userNotifications = fetchedNotifications.filter((notification) => {
        if (!notification.recipients || !Array.isArray(notification.recipients))
          return false;
        return notification.recipients.some(
          (recipient) => recipient.user_id?.id === currentUser.uid
        );
      });

      setNotifications(userNotifications);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleNotificationClick = async (notification) => {
    const recipientData = notification.recipients.find(
      (r) => r.user_id?.id === currentUser.uid
    );

    if (recipientData && !recipientData.is_read) {
      const updatedRecipients = notification.recipients.map((r) => {
        if (r.user_id?.id === currentUser.uid) {
          return { ...r, is_read: true };
        }
        return r;
      });

      try {
        const notificationDocRef = doc(db, "notifications", notification.id);
        await updateDoc(notificationDocRef, { recipients: updatedRecipients });
      } catch (error) {
        console.error("Error updating notification: ", error);
      }
    }
  };

  const unreadCount = notifications.reduce((count, notification) => {
    const recipientData = notification.recipients.find(
      (r) => r.user_id?.id === currentUser.uid
    );
    return count + (recipientData && !recipientData.is_read ? 1 : 0);
  }, 0);

  return (
    <div className="relative inline-block">
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-700"
      >
        <Badge badgeContent={unreadCount} color="error">
          <BellIcon className="h-6 w-6" style={{ color: "#D66C42" }} />
        </Badge>
      </IconButton>
      {open && (
        <Paper className="absolute z-50 right-0 mt-2 w-80 max-h-96 overflow-y-auto shadow-lg">
          {notifications.length === 0 ? (
            <Typography variant="body2" className="p-4">
              There's no notification
            </Typography>
          ) : (
            notifications.map((notification) => {
              const recipientData = notification.recipients.find(
                (r) => r.user_id?.id === currentUser.uid
              );
              const isRead = recipientData?.is_read;
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b last:border-none ${
                    isRead ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50 cursor-pointer`}
                >
                  <Typography variant="subtitle1" className="font-medium">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {notification.date.toDate().toLocaleString()}
                  </Typography>
                </div>
              );
            })
          )}
        </Paper>
      )}
    </div>
  );
};

export default NotificationBell;

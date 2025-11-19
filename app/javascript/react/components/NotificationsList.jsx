import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { NOTIFICATIONS_QUERY, UNREAD_NOTIFICATIONS_COUNT_QUERY } from "../graphql/queries";
import { MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ } from "../graphql/mutations";

const NotificationsList = () => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const { data, loading, error, refetch } = useQuery(NOTIFICATIONS_QUERY, {
    variables: { unreadOnly: showUnreadOnly },
    pollInterval: 30000, // Poll every 30 seconds
    fetchPolicy: "cache-and-network"
  });

  const { data: countData, refetch: refetchCount } = useQuery(UNREAD_NOTIFICATIONS_COUNT_QUERY, {
    pollInterval: 30000,
    fetchPolicy: "cache-and-network"
  });

  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [{ query: NOTIFICATIONS_QUERY, variables: { unreadOnly: showUnreadOnly } }, UNREAD_NOTIFICATIONS_COUNT_QUERY],
    awaitRefetchQueries: true
  });

  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: [{ query: NOTIFICATIONS_QUERY, variables: { unreadOnly: showUnreadOnly } }, UNREAD_NOTIFICATIONS_COUNT_QUERY],
    awaitRefetchQueries: true
  });

  const handleMarkRead = async (id) => {
    try {
      await markRead({ variables: { id } });
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const unreadCount = countData?.unreadNotificationsCount || 0;
  const notifications = data?.notifications || [];

  if (loading && !data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              showUnreadOnly
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {showUnreadOnly ? "Show All" : "Unread Only"}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-500/50 px-4 py-3 text-sm text-red-300">
          {error.message || "Error loading notifications"}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-400">
            {showUnreadOnly ? "No unread notifications" : "No notifications yet"}
          </p>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 transition-all ${
                notification.read
                  ? "border-gray-700 bg-gray-800/50"
                  : "border-indigo-500/50 bg-indigo-900/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    )}
                    <span className="text-xs font-medium text-indigo-400 uppercase">
                      {notification.notificationType.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white">{notification.message}</p>
                  {notification.notifiable && (
                    <div className="mt-2 text-sm text-gray-400">
                      {notification.notifiable.__typename === "Task" && (
                        <span>
                          Task: {notification.notifiable.title} in{" "}
                          {notification.notifiable.project?.name}
                        </span>
                      )}
                      {notification.notifiable.__typename === "Project" && (
                        <span>Project: {notification.notifiable.name}</span>
                      )}
                    </div>
                  )}
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="ml-4 rounded px-3 py-1 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;


import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';

type Screen = 'dashboard' | 'notifications';

interface NotificationsProps {
  onNavigate: (screen: Screen) => void;
}

type NotificationType = 'success' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  date: Date;
}

export default function Notifications({ onNavigate }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Job Completed',
      message: 'Your delivery to Chicago, IL has been marked as complete. Payment is being processed.',
      timestamp: '2 hours ago',
      read: false,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'info',
      title: 'New Route Assignment',
      message: 'You have been assigned a new route from Dallas, TX to Houston, TX. Departure scheduled for tomorrow at 6:00 AM.',
      timestamp: '5 hours ago',
      read: false,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'warning',
      title: 'Document Expiring Soon',
      message: "Your commercial driver's license will expire in 30 days. Please update your credentials.",
      timestamp: '1 day ago',
      read: true,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      type: 'warning',
      title: 'Document Expiring Soon',
      message: "Your commercial driver's license will expire in 30 days. Please update your credentials.",
      timestamp: '1 day ago',
      read: true,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      type: 'warning',
      title: 'Document Expiring Soon',
      message: "Your commercial driver's license will expire in 30 days. Please update your credentials.",
      timestamp: '1 day ago',
      read: true,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '6',
      type: 'warning',
      title: 'Document Expiring Soon',
      message: "Your commercial driver's license will expire in 30 days. Please update your credentials.",
      timestamp: '3 days ago',
      read: true,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return CheckCircle2;
      case 'warning':
        return AlertCircle;
      case 'info':
      default:
        return Info;
    }
  };

  const getNotificationColors = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[#d1fae5]',
          icon: 'text-[#059669]',
        };
      case 'warning':
        return {
          bg: 'bg-[#fed7aa]',
          icon: 'text-[#ea580c]',
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#dbeafe]',
          icon: 'text-[#0066cc]',
        };
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getDateGroup = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (notificationDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (notificationDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else if (date >= weekAgo) {
      return 'This Week';
    } else {
      return 'Earlier';
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    notifications.forEach((notification) => {
      const group = getDateGroup(notification.date);
      groups[group].push(notification);
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header 
          title="Notifications" 
          onBack={() => onNavigate('dashboard')} 
          showBackButton 
          showNotifications={false}
          showProfile={false}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-4">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#686c74] font-normal">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[14px] text-[#2383f8] font-semibold hover:text-[#1a6cd9] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-2">
            {Object.keys(groupedNotifications).map((group) => {
              const groupNotifications = groupedNotifications[group];
              if (groupNotifications.length > 0) {
                return (
                  <div key={group} className="flex flex-col gap-2">
                    {/* Date Group Label */}
                    <div className="flex items-center justify-center">
                      <span className="text-[12px] font-medium text-[#202021]">
                        {group}
                      </span>
                    </div>
                    
                    {/* Notifications in this group */}
                    {groupNotifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colors = getNotificationColors(notification.type);
                      const isUnread = !notification.read;

                      return (
                        <div
                          key={notification.id}
                          className={`${
                            isUnread 
                              ? 'bg-[#f5f9ff]' 
                              : 'bg-white'
                          } rounded-lg shadow-[0px_2px_6px_0px_rgba(0,0,0,0.05)] p-4 flex gap-3`}
                        >
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={1.67} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <p className={`${
                              notification.type === 'warning' 
                                ? 'text-[15px] font-semibold' 
                                : 'text-[16px] font-medium'
                            } text-black leading-[22.5px]`}>
                              {notification.title}
                            </p>
                            <p className="text-[14px] text-[#777c86] font-normal leading-[20px]">
                              {notification.message}
                            </p>
                            <p className="text-[14px] text-[#84878c] font-normal leading-[21px] mt-0.5">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export unread count for use in other components
export function useNotificationCount() {
  // In a real app, this would come from a global state or API
  return 2; // Matches the Figma design
}
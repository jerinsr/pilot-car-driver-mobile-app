import { AlertCircle, AlertTriangle, Bell, BellOff, CheckCircle2, ChevronRight, Info, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import { CompleteJobModal } from './CompleteJobModal';
import { AssignedJob } from './AssignedJobCard';

type Screen = 'dashboard' | 'notifications';

interface NotificationsProps {
  onNavigate: (screen: Screen) => void;
}

type NotificationType = 'success' | 'info' | 'warning' | 'reminder' | 'urgent';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  date: Date;
  /** Present on invoice-reminder notifications — clicking opens that job's Additional Charges screen. */
  jobId?: string;
}

// Job the invoice reminder notifications point to — completed, awaiting invoice submission.
const PENDING_INVOICE_JOB: AssignedJob = {
  id: 'PC-010',
  requestId: 'RQ-2420',
  tripId: 'TR-9025',
  jobTitle: 'Lead Pilot - Transformer',
  jobType: 'Convoy',
  origin: 'Houston, TX',
  destination: 'Dallas, TX',
  departureDate: '2026-02-20T06:00:00Z',
  returnDate: '2026-02-21T18:00:00Z',
  distance: '240 mi',
  loadType: 'Electrical Transformer',
  vehicleType: 'Heavy Haul Trailer',
  assignedPay: '$2,850.00',
  requestingCompany: 'Texas Power Grid LLC',
  status: 'completed',
  assignedDate: '2026-02-15',
  position: 'Lead',
  driverName: 'Michael Thompson',
  rateType: 'flat',
};

export default function Notifications({ onNavigate }: NotificationsProps) {
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'inv-final',
      type: 'urgent',
      title: 'If No Action in 4 Hours',
      message: 'Invoice will be sent to you for review and approval.',
      timestamp: '10 minutes ago',
      read: false,
      date: new Date(Date.now() - 10 * 60 * 1000),
      jobId: 'PC-010',
    },
    {
      id: 'inv-reminder-2',
      type: 'reminder',
      title: 'Reminder 2 – 30 Mins Before',
      message: 'Please review the system generated invoice. You have 30 minutes left.',
      timestamp: '1 hour ago',
      read: false,
      date: new Date(Date.now() - 1 * 60 * 60 * 1000),
      jobId: 'PC-010',
    },
    {
      id: 'inv-reminder-1',
      type: 'reminder',
      title: 'Reminder 1 – 2 Hours Before',
      message: 'Please review the system generated invoice. You have 2 hours left.',
      timestamp: '2 hours ago',
      read: false,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      jobId: 'PC-010',
    },
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
      case 'reminder':
        return Bell;
      case 'urgent':
        return AlertTriangle;
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
          unreadBg: 'bg-[#f2fdf7]',
          border: 'border-[#d1fae5]',
          dot: 'bg-[#059669]',
          tagBg: 'bg-[#d1fae5]',
          tagText: 'text-[#047857]',
        };
      case 'warning':
        return {
          bg: 'bg-[#fed7aa]',
          icon: 'text-[#ea580c]',
          unreadBg: 'bg-[#fff8f2]',
          border: 'border-[#fed7aa]',
          dot: 'bg-[#ea580c]',
          tagBg: 'bg-[#fed7aa]',
          tagText: 'text-[#c2410c]',
        };
      case 'reminder':
        return {
          bg: 'bg-[#ffe9cc]',
          icon: 'text-[#f89823]',
          unreadBg: 'bg-[#fff8f0]',
          border: 'border-[#fde3c2]',
          dot: 'bg-[#f89823]',
          tagBg: 'bg-[#ffe9cc]',
          tagText: 'text-[#c2670c]',
        };
      case 'urgent':
        return {
          bg: 'bg-[#fecaca]',
          icon: 'text-[#dc2626]',
          unreadBg: 'bg-[#fef2f2]',
          border: 'border-[#fecaca]',
          dot: 'bg-[#dc2626]',
          tagBg: 'bg-[#fecaca]',
          tagText: 'text-[#b91c1c]',
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#dbeafe]',
          icon: 'text-[#0066cc]',
          unreadBg: 'bg-[#f5f9ff]',
          border: 'border-[#dbeafe]',
          dot: 'bg-[#0066cc]',
          tagBg: 'bg-[#dbeafe]',
          tagText: 'text-[#0066cc]',
        };
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.jobId) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    setShowChargesModal(true);
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
        {/* Sticky header info */}
        <div className="sticky top-0 z-10 bg-[#f6f6f6]/95 backdrop-blur-sm px-4 pt-3 pb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4b4f56] bg-white border border-gray-200 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2383f8]" />
            {unreadCount} unread
          </span>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-[13px] text-[#84878c] font-medium active:text-[#dc2626] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center px-8 py-20">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4">
              <BellOff className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-[15px] font-semibold text-gray-900">You're all caught up</p>
            <p className="text-[13px] text-gray-500 mt-1">New notifications will show up here.</p>
          </div>
        ) : (
          <div className="px-4 pb-6 flex flex-col gap-3">
            {Object.keys(groupedNotifications).map((group) => {
              const groupNotifications = groupedNotifications[group];
              if (groupNotifications.length === 0) return null;

              return (
                <div key={group} className="flex flex-col gap-2">
                  {/* Date Group Label */}
                  <span className="sticky top-[42px] z-[5] bg-[#f6f6f6]/95 backdrop-blur-sm -mx-4 px-4 py-1 text-[11px] font-semibold text-[#9a9da3] uppercase tracking-wider">
                    {group}
                  </span>

                  {/* Notifications in this group */}
                  {groupNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colors = getNotificationColors(notification.type);
                    const isUnread = !notification.read;
                    const isClickable = !!notification.jobId;
                    const isSevere = notification.type === 'reminder' || notification.type === 'urgent';

                    return (
                      <div
                        key={notification.id}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onClick={isClickable ? () => handleNotificationClick(notification) : undefined}
                        onKeyDown={
                          isClickable
                            ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') handleNotificationClick(notification);
                              }
                            : undefined
                        }
                        className={`group relative flex gap-3 rounded-2xl border p-3.5 transition-all ${
                          isUnread ? colors.unreadBg : 'bg-white'
                        } ${colors.border} ${
                          isClickable ? 'cursor-pointer active:scale-[0.98] active:brightness-95' : ''
                        }`}
                      >
                        {/* Unread accent bar */}
                        {isUnread && (
                          <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${colors.dot}`} />
                        )}

                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={1.8} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-[14.5px] leading-snug ${
                                isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'
                              }`}
                            >
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              aria-label="Dismiss notification"
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 w-6 h-6 -mt-1 -mr-1 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 flex-shrink-0 transition-opacity"
                            >
                              <span className="text-[16px] leading-none">×</span>
                            </button>
                          </div>
                          <p className="text-[13px] text-[#777c86] leading-snug mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[11.5px] text-[#9a9da3]">{notification.timestamp}</span>
                            {isSevere && (
                              <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${colors.tagBg} ${colors.tagText}`}>
                                {notification.type === 'urgent' ? 'Action needed' : 'Reminder'}
                              </span>
                            )}
                            {isClickable && (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CompleteJobModal
        open={showChargesModal}
        job={PENDING_INVOICE_JOB}
        initialStep="charges"
        onClose={() => setShowChargesModal(false)}
        onConfirm={() => setShowChargesModal(false)}
      />
    </div>
  );
}

// Export unread count for use in other components
export function useNotificationCount() {
  // In a real app, this would come from a global state or API
  return 2; // Matches the Figma design
}
export type NotificationType = 
  | 'membership_expiry'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'workout_reminder'
  | 'payment_success'
  | 'admin_alert'
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

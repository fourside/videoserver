import * as React from 'react';

interface NotificationProps {
  message: string;
  isShown: boolean;
}
const Notification = ({ message, isShown }: NotificationProps) => (
  <div
    className={`notification is-success http-notify ${
      isShown ? 'is-shown' : 'is-hidden'
    }`}>
    <button className="delete" />
    <span>{message}</span>
  </div>
);

export default Notification;

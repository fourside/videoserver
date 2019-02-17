import * as React from 'react';

interface NotificationProps {
  message: string
  isShown: boolean
}
export default class Notification extends React.Component<NotificationProps, {}> {

  render() {
    return (
      <div className={`notification is-success http-notify ${this.props.isShown ? "is-shown" : "is-hidden"}`} >
        <button className="delete"></button>
        {this.props.message}
      </div>
    );
  }

}


import React from "react";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationIcon,
  XCircleIcon,
  BellIcon,
} from "@heroicons/react/outline";

export const displayIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon />;
    case "info":
      return <InformationCircleIcon />;
    case "error":
      return <XCircleIcon />;
    case "warning":
      return <ExclamationIcon />;
    default:
      return <BellIcon />;
  }
};

const ToastMessage = ({type, message}) =>
  toast[type](
    <div style={{display: "flex", color: "white"}}>
      <div
        style={{
          fontSize: 15,
          paddingTop: 8,
          flexShrink: 0,
          textAlign: "center",
          width: "30px",
        }}
      >
        {displayIcon(type)}
      </div>
      <div style={{flexGrow: 1, fontSize: 15, padding: "8px 12px"}}>
        {message}
      </div>
    </div>
  );

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

ToastMessage.dismiss = toast.dismiss;

export default ToastMessage;

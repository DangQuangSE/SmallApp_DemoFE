import type { FC } from "react";
import "./auth.css";

interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const GoogleButton: FC<GoogleButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      className="btn btn-google"
      onClick={onClick}
      disabled={disabled}
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" />
      Đăng nhập với Google
    </button>
  );
};

export default GoogleButton;

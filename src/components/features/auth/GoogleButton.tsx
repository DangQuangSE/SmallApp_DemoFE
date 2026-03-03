import type { FC } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import "./auth.css";

interface GoogleButtonProps {
  onSuccess: (credential: string) => void;
  disabled?: boolean;
}

const GoogleButton: FC<GoogleButtonProps> = ({
  onSuccess,
  disabled = false,
}) => {
  const handleSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      onSuccess(response.credential);
    }
  };

  if (disabled) {
    return (
      <button type="button" className="btn btn-google" disabled>
        <img src="https://www.google.com/favicon.ico" alt="Google" />
        Đăng nhập với Google
      </button>
    );
  }

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google Login Failed")}
        width="100%"
        text="signin_with"
        shape="rectangular"
        size="large"
      />
    </div>
  );
};

export default GoogleButton;

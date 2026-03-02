import { useState, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { type UseFormReturn } from "react-hook-form";

import { type PasswordFormData } from "../../../../utils/validators";

interface PasswordStepProps {
  form: UseFormReturn<PasswordFormData>;
  onSubmit: (data: PasswordFormData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const PasswordStep: FC<PasswordStepProps> = ({
  form,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    return [
      { label: "Ít nhất 8 ký tự", met: password.length >= 8 },
      { label: "Có chữ hoa", met: /[A-Z]/.test(password) },
      { label: "Có chữ thường", met: /[a-z]/.test(password) },
      { label: "Có số", met: /[0-9]/.test(password) },
    ];
  };

  const currentPassword = form.watch("password") || "";
  const passwordRequirements = getPasswordStrength(currentPassword);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Mật khẩu
        </label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`form-input ${form.formState.errors.password ? "error" : ""}`}
            placeholder="••••••••"
            {...form.register("password")}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="error-message">
            <FontAwesomeIcon icon={faCircleXmark} />
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Password Requirements */}
      {currentPassword && (
        <div className="password-requirements">
          <h4>Yêu cầu mật khẩu:</h4>
          {passwordRequirements.map((req, index) => (
            <div key={index} className={`requirement ${req.met ? "met" : ""}`}>
              <FontAwesomeIcon
                icon={req.met ? faCircleCheck : faCircleXmark}
                className="requirement-icon"
              />
              {req.label}
            </div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Xác nhận mật khẩu
        </label>
        <div className="password-input-wrapper">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className={`form-input ${form.formState.errors.confirmPassword ? "error" : ""}`}
            placeholder="••••••••"
            {...form.register("confirmPassword")}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="error-message">
            <FontAwesomeIcon icon={faCircleXmark} />
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? <span className="spinner" /> : "Hoàn tất đăng ký"}
      </button>

      <p className="text-center">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="Quay lại bước xác minh OTP"
        >
          ← Quay lại
        </button>
      </p>
    </form>
  );
};

export default PasswordStep;

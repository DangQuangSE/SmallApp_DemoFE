import { type FC } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { type UseFormReturn } from "react-hook-form";

import { type EmailFormData } from "../../../../utils/validators";
import GoogleButton from "../GoogleButton";
import { ROUTES } from "../../../../constants/routes";

interface EmailStepProps {
  form: UseFormReturn<EmailFormData>;
  onSubmit: (data: EmailFormData) => Promise<void>;
  onGoogleLogin: (credential: string) => Promise<void>;
  isLoading: boolean;
}

const EmailStep: FC<EmailStepProps> = ({
  form,
  onSubmit,
  onGoogleLogin,
  isLoading,
}) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`form-input ${form.formState.errors.email ? "error" : ""}`}
          placeholder="example@email.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="error-message">
            <FontAwesomeIcon icon={faCircleXmark} />
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? <span className="spinner" /> : "Tiếp theo"}
      </button>

      <div className="divider">hoặc</div>

      <GoogleButton onSuccess={onGoogleLogin} disabled={isLoading} />

      <p className="text-center">
        Đã có tài khoản?{" "}
        <Link to={ROUTES.LOGIN} className="auth-link">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
};

export default EmailStep;

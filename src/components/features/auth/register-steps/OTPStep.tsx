import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { type UseFormReturn } from "react-hook-form";

import { type OTPFormData } from "../../../../utils/validators";
import OTPInput from "../OTPInput";

interface OTPStepProps {
  form: UseFormReturn<OTPFormData>;
  onSubmit: (data: OTPFormData) => Promise<void>;
  onResendOTP: () => Promise<void>;
  onBack: () => void;
  resendCooldown: number;
  isLoading: boolean;
}

const OTPStep: FC<OTPStepProps> = ({
  form,
  onSubmit,
  onResendOTP,
  onBack,
  resendCooldown,
  isLoading,
}) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="otp-input-container">
        <OTPInput
          length={6}
          onComplete={(value: string) => form.setValue("otp", value)}
          hasError={!!form.formState.errors.otp}
        />
        {form.formState.errors.otp && (
          <p className="error-message">
            <FontAwesomeIcon icon={faCircleXmark} />
            {form.formState.errors.otp.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? <span className="spinner" /> : "Xác minh"}
      </button>

      <div className="resend-otp">
        Không nhận được mã?{" "}
        <button
          type="button"
          className="resend-button"
          onClick={onResendOTP}
          disabled={resendCooldown > 0 || isLoading}
        >
          {resendCooldown > 0 ? `Gửi lại (${resendCooldown}s)` : "Gửi lại"}
        </button>
      </div>

      <p className="text-center">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="Quay lại bước nhập email"
        >
          ← Quay lại
        </button>
      </p>
    </form>
  );
};

export default OTPStep;

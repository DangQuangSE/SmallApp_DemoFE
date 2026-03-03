import type { FC } from "react";
import type { PaymentDto } from "../../../types/order.types";
import { formatVND, formatDateTime } from "../../../utils/format";
import "./orders.css";

interface PaymentHistoryProps {
  payments: PaymentDto[];
}

const PaymentHistory: FC<PaymentHistoryProps> = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="payment-history">
        <h3>Lịch sử giao dịch</h3>
        <p className="payment-history-empty">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div className="payment-history">
      <h3>Lịch sử giao dịch</h3>
      <table className="payment-history-table">
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Phương thức</th>
            <th>Số tiền</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.paymentId}>
              <td>{p.transactionRef || `#${p.paymentId}`}</td>
              <td>{p.paymentMethod || "VNPay"}</td>
              <td className="payment-amount">{formatVND(p.amount)}</td>
              <td>{formatDateTime(p.paymentDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;

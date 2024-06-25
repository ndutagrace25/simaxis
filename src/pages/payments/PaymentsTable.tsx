import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";
import { getPayments, Payment } from "../../features/payment/paymentSlice";

const PaymentsTable = () => {
  const { payments, loadingPayments } = useSelector(
    (state: RootState) => state.payment
  );
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = payments.map((item: Payment) => {
    return {
      ...item,
      payment_date: moment(item.payment_date).format("MM/DD/YYYY"),
    };
  });

  const columns = [
    {
      title: "Meter Number",
      dataIndex: "meter_number",
      key: "meter_number",
    },
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      key: "payment_date",
    },

    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Payment Code",
      dataIndex: "payment_code",
      key: "payment_code",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
  ];

  useEffect(() => {
    dispatch(getPayments());
  }, []);

  return (
    <div className="mt-3">
      {loadingPayments ? (
        <Spin />
      ) : (
        <>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </div>
  );
};

export default PaymentsTable;

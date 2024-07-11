import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Input, Spin, Table, Tooltip } from "antd";
import { getPayments, Payment } from "../../features/payment/paymentSlice";
import { IconRefresh, IconDownload } from "@tabler/icons-react";
import { CSVLink } from "react-csv";

const PaymentsTable = () => {
  const [keyword, setKeyword] = useState<string>("");

  const { payments, loadingPayments } = useSelector(
    (state: RootState) => state.payment
  );
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = payments.map((item: Payment) => {
    return {
      ...item,
      payment_date: moment(item.payment_date).format("MM/DD/YYYY"),
      amount: `KES ${item.amount}`,
    };
  });
  const downloadData = payments.map((item: Payment) => {
    return {
      payment_date: moment(item.payment_date).format("MM/DD/YYYY"),
      amount: item.amount,
      payment_method: item.payment_method,
      phone_number: item.phone_number,
      payment_code: item.payment_code,
      meter_number: item.meter_number,
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
  ];

  useEffect(() => {
    dispatch(getPayments(keyword));
  }, [keyword]);

  const refresh = () => {
    dispatch(getPayments(""));
    setKeyword("");
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <Input
          className="col-md-2"
          placeholder="Search...(if phone 254..)"
          value={keyword}
          onChange={(e: any) => setKeyword(e.target.value)}
          name="keyword"
        />
        <div className="d-flex justify-content-center">
          <CSVLink
            data={downloadData}
            target="_blank"
            filename={
              "Payments" +
              "_" +
              moment(new Date()).format("DD/MM/YYYY HH:mm:ss") +
              ".csv"
            }
          >
            <Button type="dashed">
              <span className="me-2">Download</span>
              <span>
                <IconDownload width={16} />
              </span>
            </Button>
          </CSVLink>
        </div>
        <Tooltip title="refresh data">
          <IconRefresh
            className="text-primary cursor"
            onClick={() => refresh()}
          />
        </Tooltip>
      </div>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Spin,
  Table,
  Tooltip,
  Card,
  Pagination,
  Row,
  Col,
  Badge,
} from "antd";
import { getPayments, Payment } from "../../features/payment/paymentSlice";
import {
  IconRefresh,
  IconDownload,
  IconCalendar,
  IconCurrency,
  IconHash,
} from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import { isMobile } from "react-device-detect";

const PaymentsTable = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 10 cards per page for mobile

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
  }, [dispatch, keyword]);

  const refresh = () => {
    dispatch(getPayments(""));
    setKeyword("");
  };

  // Mobile card component
  const PaymentCard = ({ paymentItem }: { paymentItem: Payment }) => (
    <Card
      className="mb-3 shadow-sm"
      style={{ borderRadius: "12px" }}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6 className="mb-1 fw-bold text-primary">
            Meter: {paymentItem.meter_number}
          </h6>
          <small className="fw-bold">
            Payment Code: {paymentItem.payment_code}
          </small>
        </div>
        <Badge
          color={paymentItem.payment_method === "M-Pesa" ? "green" : "blue"}
          text={paymentItem.payment_method}
        />
      </div>

      <Row gutter={[16, 8]}>
        <Col span={12}>
          <div className="d-flex align-items-center mb-2">
            <IconCurrency size={16} className="text-success me-2" />
            <div>
              <small className="text-muted d-block">Amount</small>
              <span className="fw-bold text-success">
                KES {paymentItem.amount}
              </span>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="d-flex align-items-center mb-2">
            <div className="flex-grow-1">
              <small className="text-muted d-block">Phone</small>
              <span
                className="fw-light text-info d-block"
                style={{
                  wordBreak: "break-all",
                  fontSize: "0.7rem",
                  lineHeight: "1.2",
                }}
              >
                {paymentItem.phone_number}
              </span>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div className="d-flex align-items-center mb-3">
            <IconCalendar size={16} className="text-warning me-2" />
            <div>
              <small className="text-muted d-block">Payment Date</small>
              <span className="fw-bold text-warning">
                {moment(paymentItem.payment_date).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Pagination logic for mobile
  const getPaginatedPayments = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return payments.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-3">
      {/* Header Controls */}
      <div
        className={`d-flex ${
          isMobile ? "flex-column" : "justify-content-between col-md-12"
        } mb-3`}
      >
        <div className={`${isMobile ? "mb-3" : "col-md-5"}`}>
          <Input
            className={isMobile ? "w-100" : "col-md-4"}
            placeholder="Search...(if phone 254..)"
            value={keyword}
            onChange={(e: any) => setKeyword(e.target.value)}
            name="keyword"
          />
        </div>

        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-6"
          } gap-3`}
        >
          {!isMobile && (
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
                <Button type="dashed" size={isMobile ? "small" : "middle"}>
                  <span className="me-2">Download</span>
                  <span>
                    <IconDownload width={16} />
                  </span>
                </Button>
              </CSVLink>
            </div>
          )}

          <Tooltip title="refresh data">
            <IconRefresh
              className="text-primary cursor"
              onClick={() => refresh()}
              size={isMobile ? 20 : 24}
            />
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      {loadingPayments ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading payments...</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            // Mobile Card View
            <div>
              {getPaginatedPayments().length > 0 ? (
                <>
                  <div className="mb-3">
                    {getPaginatedPayments().map(
                      (paymentItem: Payment, index: number) => (
                        <PaymentCard
                          key={`${paymentItem.id}-${index}`}
                          paymentItem={paymentItem}
                        />
                      )
                    )}
                  </div>

                  {payments.length > pageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPage}
                        total={payments.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} payments`
                        }
                        size="small"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <IconHash size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No payments found</h5>
                  <p className="text-muted">
                    Try searching with a different keyword or check your
                    filters.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Desktop Table View
            <Table dataSource={dataSource} columns={columns} />
          )}
        </>
      )}
    </div>
  );
};

export default PaymentsTable;

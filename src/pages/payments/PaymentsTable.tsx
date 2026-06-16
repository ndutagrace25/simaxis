/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import axiosInstance from "../../utils/axios";
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
import {
  getPayments,
  Payment,
  setPaymentPagination,
} from "../../features/payment/paymentSlice";
import {
  IconRefresh,
  IconDownload,
  IconCalendar,
  IconCurrency,
  IconHash,
} from "@tabler/icons-react";
import { isMobile } from "react-device-detect";
import Swal from "sweetalert2";

const PAGE_SIZE_OPTIONS = ["10", "50", "100"];

const PaymentsTable = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const {
    payments,
    loadingPayments,
    totalPayments,
    currentPaymentsPage,
    paymentsPageSize,
  } = useSelector(
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
    dispatch(
      getPayments({
        keyword,
        page: paymentsPage,
        limit: paymentsPageSize,
        startDate,
        endDate,
      })
    );
  }, [dispatch, endDate, keyword, paymentsPage, paymentsPageSize, startDate]);

  const refresh = () => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setPaymentsPage(1);
    dispatch(
      setPaymentPagination({
        total: totalPayments,
        page: 1,
        limit: paymentsPageSize,
      })
    );
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    if (field === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    setPaymentsPage(1);
    dispatch(
      setPaymentPagination({
        total: totalPayments,
        page: 1,
        limit: paymentsPageSize,
      })
    );
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);

    try {
      const params = new URLSearchParams();

      if (keyword) {
        params.set("keyword", keyword);
      }

      if (startDate) {
        params.set("start_date", startDate);
      }

      if (endDate) {
        params.set("end_date", endDate);
      }

      params.set("export_all", "true");

      const response = await axiosInstance.get(`/payments?${params.toString()}`);
      const exportPayments: Payment[] = response.data.payments || [];

      if (!exportPayments.length) {
        Swal.fire("Info", "No payments available for the selected filter.", "info");
        return;
      }

      const headers = [
        "Payment Date",
        "Amount",
        "Payment Method",
        "Phone Number",
        "Payment Code",
        "Meter Number",
      ];
      const rows = exportPayments.map((item: Payment) => [
        moment(item.payment_date).format("MM/DD/YYYY"),
        item.amount,
        item.payment_method,
        item.phone_number,
        item.payment_code,
        item.meter_number,
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        "Payments_" + moment(new Date()).format("DD-MM-YYYY_HH-mm-ss") + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
    } finally {
      setDownloadingCsv(false);
    }
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

  const handlePageChange = (page: number, nextPageSize?: number) => {
    if (nextPageSize && nextPageSize !== paymentsPageSize) {
      setPaymentsPage(1);
      dispatch(
        setPaymentPagination({
          total: totalPayments,
          page: 1,
          limit: nextPageSize,
        })
      );
      return;
    }

    setPaymentsPage(page);
  };

  const paginationSummary = (total: number, range: [number, number]) =>
    isMobile
      ? `${range[0]}-${range[1]} of ${total}`
      : `${range[0]}-${range[1]} of ${total} payments`;

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
            className={isMobile ? "w-100" : "col-md-12"}
            placeholder="Search...(if phone 254..)"
            value={keyword}
            onChange={(e: any) => {
              setKeyword(e.target.value);
              setPaymentsPage(1);
              dispatch(
                setPaymentPagination({
                  total: totalPayments,
                  page: 1,
                  limit: paymentsPageSize,
                })
              );
            }}
            name="keyword"
          />
        </div>

        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-6"
          } gap-3`}
        >
          <div className={isMobile ? "w-100" : "col-md-3"}>
            <small className="text-muted d-block mb-1">Start Date</small>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(event) =>
                handleDateChange("start", event.target.value)
              }
              max={endDate || undefined}
            />
          </div>

          <div className={isMobile ? "w-100" : "col-md-3"}>
            <small className="text-muted d-block mb-1">End Date</small>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(event) => handleDateChange("end", event.target.value)}
              min={startDate || undefined}
            />
          </div>

          {isMobile ? (
            <div className="d-flex w-100 gap-2">
              <Button
                type="dashed"
                className="flex-grow-1"
                loading={downloadingCsv}
                onClick={handleDownloadCsv}
              >
                <span className="me-2">Download</span>
                <IconDownload width={16} />
              </Button>
              <Button
                type="default"
                className="flex-grow-1"
                onClick={() => refresh()}
              >
                <span className="me-2">Refresh</span>
                <IconRefresh width={16} />
              </Button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <Button
                  type="dashed"
                  size="middle"
                  loading={downloadingCsv}
                  onClick={handleDownloadCsv}
                >
                  <span className="me-2">Download</span>
                  <span>
                    <IconDownload width={16} />
                  </span>
                </Button>
              </div>

              <Tooltip title="refresh data">
                <IconRefresh
                  className="text-primary cursor"
                  onClick={() => refresh()}
                  size={24}
                />
              </Tooltip>
            </>
          )}
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
              {payments.length > 0 ? (
                <>
                  <div className="mb-3">
                    {payments.map((paymentItem: Payment) => (
                      <PaymentCard key={paymentItem.id} paymentItem={paymentItem} />
                    ))}
                  </div>

                  {totalPayments > paymentsPageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPaymentsPage}
                        total={totalPayments}
                        pageSize={paymentsPageSize}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                        showQuickJumper={false}
                        showTotal={paginationSummary}
                        size="small"
                        responsive
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
            <Table
              rowKey="id"
              dataSource={dataSource}
              columns={columns}
              pagination={{
                current: currentPaymentsPage,
                total: totalPayments,
                pageSize: paymentsPageSize,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                onChange: handlePageChange,
                onShowSizeChange: handlePageChange,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PaymentsTable;

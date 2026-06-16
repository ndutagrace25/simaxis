/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import axiosInstance from "../../utils/axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Spin, Table, Tooltip, Card, Pagination, Row, Col } from "antd";
import {
  getTokens,
  setTokenPagination,
  Token,
  sendTokensManually,
} from "../../features/tokens/tokenSlice";
import {
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconCurrency,
  IconBolt,
  IconHash,
} from "@tabler/icons-react";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import Select from "react-select";
import { GenerateToken, ResendTokenModal } from ".";
import { isMobile } from "react-device-detect";
import Swal from "sweetalert2";

const PAGE_SIZE_OPTIONS = ["10", "50", "100"];

const TokensTable = () => {
  const {
    tokens,
    loadingTokens,
    resendingToken,
    totalTokens,
    currentPage,
    pageSize,
  } = useSelector(
    (state: RootState) => state.token
  );
  const { generatingToken } = useSelector((state: RootState) => state.meter);
  const [meter_id, setMeter] = useState<any>(null);

  const { meters } = useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();
  const [isResendTokenModalOpen, setIsResendTokenModalOpen] = useState(false);
  const [phone, setPhone] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [token_id, setTokenId] = useState<any>(null);
  const [meter_number, setMeterNumber] = useState<any>(null);
  const [tokenPage, setTokenPage] = useState(1);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const displayMeters = meters.map((meter: Meter) => {
    return { value: meter?.id, label: meter?.serial_number };
  });

  const columns = [
    {
      title: "Meter Number",
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Units",
      dataIndex: "total_units",
      key: "total_units",
    },
    {
      title: "Type",
      dataIndex: "token_type",
      key: "token_type",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const handleResendToken = (
    token: string,
    token_id: string,
    meter_number: string
  ) => {
    const data = {
      token,
      token_id,
      meter_number,
      phone,
    };
    dispatch(sendTokensManually(data));
    setIsResendTokenModalOpen(false);
    setPhone("");
    setToken("");
    setTokenId("");
    setMeterNumber("");
  };

  const handleCancelResendToken = () => {
    setIsResendTokenModalOpen(false);
  };

  const dataSource = tokens.map((item: Token) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      serial_number: item.Meter.serial_number,
      amount: `KES ${item.amount}`,
      total_units: `${item.total_units} KWh`,
      action: (
        <>
          {resendingToken && item.token === token ? (
            <Spin />
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setIsResendTokenModalOpen(true);
                setToken(item.token);
                setTokenId(item.id);
                setMeterNumber(item.Meter.serial_number);
              }}
            >
              Resend
            </Button>
          )}
        </>
      ),
    };
  });

  useEffect(() => {
    dispatch(
      getTokens({
        meterId: meter_id?.value || "",
        page: tokenPage,
        limit: pageSize,
        startDate,
        endDate,
      })
    );
  }, [dispatch, endDate, meter_id?.value, pageSize, startDate, tokenPage]);

  useEffect(() => {
    dispatch(getMeters(""));
  }, [dispatch]);

  const handleMeterChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setMeter(selectedOption);
    setTokenPage(1);
    dispatch(setTokenPagination({ total: totalTokens, page: 1, limit: pageSize }));
  };

  const refresh = () => {
    setMeter(null);
    setStartDate("");
    setEndDate("");
    setTokenPage(1);
    dispatch(setTokenPagination({ total: totalTokens, page: 1, limit: pageSize }));
  };

  const handleDateChange = (
    field: "start" | "end",
    value: string
  ) => {
    if (field === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    setTokenPage(1);
    dispatch(setTokenPagination({ total: totalTokens, page: 1, limit: pageSize }));
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);

    try {
      const params = new URLSearchParams();

      if (meter_id?.value) {
        params.set("meter_id", meter_id.value);
      }

      if (startDate) {
        params.set("start_date", startDate);
      }

      if (endDate) {
        params.set("end_date", endDate);
      }

      params.set("export_all", "true");

      const response = await axiosInstance.get(`/tokens?${params.toString()}`);
      const exportTokens: Token[] = response.data.tokens || [];

      if (!exportTokens.length) {
        Swal.fire("Info", "No tokens available for the selected filter.", "info");
        return;
      }

      const headers = ["Date Created", "Meter Number", "Amount", "Units", "Token"];
      const rows = exportTokens.map((item: Token) => [
        moment(item.created_at).format("MM/DD/YYYY"),
        item.Meter.serial_number,
        item.amount,
        item.total_units,
        item.token,
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
        "Tokens_" + moment(new Date()).format("DD-MM-YYYY_HH-mm-ss") + ".csv";
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
  const TokenCard = ({ tokenItem }: { tokenItem: Token }) => (
    <Card
      className="mb-3 shadow-sm"
      style={{ borderRadius: "12px" }}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6 className="mb-1 fw-bold text-primary">
            Meter: {tokenItem.Meter.serial_number}
          </h6>
          <small className="fw-bold">Generated Token: {tokenItem.token}</small>
        </div>
      </div>

      <Row gutter={[16, 8]}>
        <Col span={12}>
          <div className="d-flex align-items-center mb-2">
            <IconCurrency size={16} className="text-success me-2" />
            <div>
              <small className="text-muted d-block">Amount</small>
              <span className="fw-bold text-success">
                KES {tokenItem.amount}
              </span>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="d-flex align-items-center mb-2">
            <IconBolt size={16} className="text-warning me-2" />
            <div>
              <small className="text-muted d-block">Units</small>
              <span className="fw-bold text-warning">
                {tokenItem.total_units} KWh
              </span>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div className="d-flex align-items-center mb-3">
            <IconCalendar size={16} className="text-info me-2" />
            <div>
              <small className="text-muted d-block">Created</small>
              <span className="fw-bold text-info">
                {moment(tokenItem.created_at).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        {resendingToken && tokenItem.token === token ? (
          <Spin size="small" />
        ) : (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setIsResendTokenModalOpen(true);
              setToken(tokenItem.token);
              setTokenId(tokenItem.id);
              setMeterNumber(tokenItem.Meter.serial_number);
            }}
            style={{ borderRadius: "6px" }}
          >
            Resend Token
          </Button>
        )}
      </div>
    </Card>
  );

  const handlePageChange = (page: number, nextPageSize?: number) => {
    if (nextPageSize && nextPageSize !== pageSize) {
      setTokenPage(1);
      dispatch(
        setTokenPagination({
          total: totalTokens,
          page: 1,
          limit: nextPageSize,
        })
      );
      return;
    }

    setTokenPage(page);
  };

  const paginationSummary = (total: number, range: [number, number]) =>
    isMobile
      ? `${range[0]}-${range[1]} of ${total}`
      : `${range[0]}-${range[1]} of ${total} tokens`;

  return (
    <div className="mt-3">
      {/* Header Controls */}
      <div
        className={`d-flex ${
          isMobile ? "flex-column" : "justify-content-between"
        } mb-3`}
      >
        <div className={`${isMobile ? "mb-3" : ""}`}>
          <GenerateToken />
        </div>

        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-6"
          } gap-3`}
        >
          <div className={isMobile ? "w-100" : "col-md-4"}>
            <small className="text-muted d-block mb-1">Meter</small>
            <Select
              value={meter_id}
              onChange={(option) => handleMeterChange(option)}
              options={displayMeters}
              placeholder="Select a meter..."
              className="w-100"
            />
          </div>

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
      {loadingTokens || generatingToken ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading tokens...</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            // Mobile Card View
            <div>
              {tokens.length > 0 ? (
                <>
                  <div className="mb-3">
                    {tokens.map((tokenItem: Token) => (
                      <TokenCard key={tokenItem.id} tokenItem={tokenItem} />
                    ))}
                  </div>

                  {totalTokens > pageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPage}
                        total={totalTokens}
                        pageSize={pageSize}
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
                  <h5 className="text-muted">No tokens found</h5>
                  <p className="text-muted">
                    Try selecting a different meter or generate new tokens.
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
                current: currentPage,
                total: totalTokens,
                pageSize,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                onChange: handlePageChange,
                onShowSizeChange: handlePageChange,
              }}
            />
          )}

          <ResendTokenModal
            token={token}
            token_id={token_id}
            meter_number={meter_number}
            isResendTokenModalOpen={isResendTokenModalOpen}
            handleCancelResendToken={handleCancelResendToken}
            phone={phone}
            setPhone={setPhone}
            handleResendToken={handleResendToken}
          />
        </>
      )}
    </div>
  );
};

export default TokensTable;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Spin, Table, Tooltip, Card, Pagination, Row, Col } from "antd";
import {
  getTokens,
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
import { CSVLink } from "react-csv";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import Select from "react-select";
import { GenerateToken, ResendTokenModal } from ".";
import { isMobile } from "react-device-detect";

const TokensTable = () => {
  const { tokens, loadingTokens, resendingToken } = useSelector(
    (state: RootState) => state.token
  );
  const { generatingToken } = useSelector((state: RootState) => state.meter);
  const [meter_id, setMeter] = useState<any>(null);

  const { meters } = useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();
  const [isResendTokenModalOpen, setIsResendTokenModalOpen] = useState(false);
  const [phone, setPhone] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [meter_number, setMeterNumber] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 6 cards per page for mobile

  const downloadData = tokens.map((item: Token) => {
    return {
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      meter_number: item.Meter.serial_number,
      amount: item.amount,
      total_units: item.total_units,
      tokens: item.token,
    };
  });

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

  const handleResendToken = (token: string, meter_number: string) => {
    const data = {
      token,
      meter_number,
      phone,
    };
    dispatch(sendTokensManually(data));
    setIsResendTokenModalOpen(false);
    setPhone("");
    setToken("");
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
    dispatch(getTokens(meter_id?.value));
    dispatch(getMeters(""));
  }, [dispatch, meter_id?.value]);

  const handleMeterChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setMeter(selectedOption);
  };

  const refresh = () => {
    dispatch(getTokens(""));
    setMeter("");
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

  // Pagination logic for mobile
  const getPaginatedTokens = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return tokens.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          <Select
            value={meter_id}
            onChange={(option) => handleMeterChange(option)}
            options={displayMeters}
            placeholder="Select a meter..."
            className={isMobile ? "w-100" : "col-md-4"}
          />

          {!isMobile && (
            <div className="d-flex justify-content-center">
              <CSVLink
                data={downloadData}
                target="_blank"
                filename={
                  "Tokens" +
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
              {getPaginatedTokens().length > 0 ? (
                <>
                  <div className="mb-3">
                    {getPaginatedTokens().map(
                      (tokenItem: Token, index: number) => (
                        <TokenCard
                          key={`${tokenItem.id}-${index}`}
                          tokenItem={tokenItem}
                        />
                      )
                    )}
                  </div>

                  {tokens.length > pageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPage}
                        total={tokens.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} tokens`
                        }
                        size="small"
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
            <Table dataSource={dataSource} columns={columns} />
          )}

          <ResendTokenModal
            token={token}
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

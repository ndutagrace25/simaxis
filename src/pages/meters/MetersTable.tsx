/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getMeters, Meter } from "../../features/meter/meterSlice";
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
  Col,
  Badge,
} from "antd";
import { AddMeter, UpdateMeter } from ".";
import { CSVLink } from "react-csv";
import {
  IconDownload,
  IconRefresh,
  IconHash,
  IconCalendar,
  IconSettings,
  IconCheck,
} from "@tabler/icons-react";
import { isMobile } from "react-device-detect";

const MetersTable = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 10 cards per page for mobile
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    meterId: string | null;
    meterNumber: string | null;
    isSynced: boolean | null;
  }>({
    isOpen: false,
    meterId: null,
    meterNumber: null,
    isSynced: null,
  });

  const {
    meters,
    loadingMeters,
    savingMeter,
    syncingMeterToStron,
    clearingMeterCredit,
    clearingMeterTamper,
  } = useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = meters.map((item: Meter) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      type: item.MeterType.name,
      serial_number: `${
        item.county_number.toString().length === 1 ? "C00" : "C0"
      }${item.county_number}-${item.serial_number}`,
      is_synced_to_stron: (
        <>
          {!item.is_synced_to_stron ? (
            <span className="text-danger">Not forwarded</span>
          ) : (
            <>
              <span className="text-success">Forwarded</span>
            </>
          )}
        </>
      ),
      action: (
        <>
          <Button
            type="text"
            size="small"
            onClick={() => openModal(item)}
            style={{
              padding: "4px 8px",
              minWidth: "40px",
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              boxShadow: "none",
            }}
            className="p-0"
          >
            <IconSettings width={16} className="text-primary" />
          </Button>
        </>
      ),
    };
  });

  const downloadData = meters.map((item: Meter) => {
    return {
      serial_number: `${
        item.county_number.toString().length === 1 ? "C00" : "C0"
      }${item.county_number}-${item.serial_number}`,
      type: item.MeterType.name,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      is_forwarded: item.is_synced_to_stron ? "Forwarded" : "Not Forwarded",
      tamper_value: item.tamper_value,
      credit_value: item.credit_value,
    };
  });

  const columns = [
    {
      title: "Meter Number",
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Is Forwarded",
      dataIndex: "is_synced_to_stron",
      key: "is_synced_to_stron",
    },
    {
      title: "Tamper Value",
      dataIndex: "tamper_value",
      key: "tamper_value",
    },
    {
      title: "Credit Value (10KWh)",
      dataIndex: "credit_value",
      key: "credit_value",
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

  useEffect(() => {
    dispatch(getMeters(keyword));
  }, [
    dispatch,
    clearingMeterCredit,
    clearingMeterTamper,
    savingMeter,
    syncingMeterToStron,
    keyword,
  ]);

  const refresh = () => {
    dispatch(getMeters(""));
  };

  const openModal = (meter: Meter) => {
    console.log("Opening modal for meter:", meter.serial_number);
    setModalState({
      isOpen: true,
      meterId: meter.id,
      meterNumber: `${meter.county_number}-${meter.serial_number}`,
      isSynced: Boolean(meter.is_synced_to_stron),
    });
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalState({
      isOpen: false,
      meterId: null,
      meterNumber: null,
      isSynced: null,
    });
  };

  // Mobile card component
  const MeterCard = ({ meterItem }: { meterItem: Meter }) => (
    <Card
      className="mb-3 shadow-sm"
      style={{ borderRadius: "12px" }}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6 className="mb-1 fw-bold text-primary">
            {`C${meterItem.county_number.toString().length === 1 ? "00" : "0"}${
              meterItem.county_number
            }-${meterItem.serial_number}`}
          </h6>
          <small className="fw-bold text-muted">
            Type: {meterItem.MeterType.name}
          </small>
        </div>
        <Badge
          color={meterItem.is_synced_to_stron ? "green" : "red"}
          text={meterItem.is_synced_to_stron ? "Forwarded" : "Not Forwarded"}
        />
      </div>

      <div className="d-flex flex-column gap-2">
        <div className="d-flex align-items-center mb-2">
          <IconSettings size={16} className="text-info me-2" />
          <div>
            <small className="text-muted d-block">Tamper Value</small>
            <span className="fw-bold text-info">{meterItem.tamper_value}</span>
          </div>
        </div>

        <div className="d-flex align-items-center mb-2">
          <IconCheck size={16} className="text-success me-2" />
          <div>
            <small className="text-muted d-block">Credit Value</small>
            <span className="fw-bold text-success">
              {meterItem.credit_value} KWh
            </span>
          </div>
        </div>

        <Col span={24}>
          <div className="d-flex align-items-center mb-3">
            <IconCalendar size={16} className="text-warning me-2" />
            <div>
              <small className="text-muted d-block">Created</small>
              <span className="fw-bold text-warning">
                {moment(meterItem.created_at).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </Col>
      </div>

      <div className="d-flex justify-content-end">
        <Button
          type="text"
          size="small"
          onClick={() => {
            const originalMeter = meters.find((m) => m.id === meterItem.id);
            if (originalMeter) openModal(originalMeter);
          }}
          style={{
            padding: "4px 8px",
            minWidth: "40px",
            minHeight: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            boxShadow: "none",
          }}
          className="p-0"
        >
          <IconSettings width={16} className="text-primary" />
        </Button>
      </div>
    </Card>
  );

  // Pagination logic for mobile
  const getPaginatedMeters = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return meters.slice(startIndex, endIndex);
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
          <AddMeter />
        </div>

        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-6"
          } gap-3`}
        >
          <Input
            className={isMobile ? "w-100" : "col-md-4"}
            placeholder="Search meter number..."
            value={keyword}
            onChange={(e: any) => setKeyword(e.target.value)}
            name="keyword"
          />

          {!isMobile && (
            <div className="d-flex justify-content-center">
              <CSVLink
                data={downloadData}
                target="_blank"
                filename={
                  "Meters" +
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
      {loadingMeters ||
      syncingMeterToStron ||
      clearingMeterTamper ||
      clearingMeterCredit ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading meters...</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            // Mobile Card View
            <div>
              {getPaginatedMeters().length > 0 ? (
                <>
                  <div className="mb-3">
                    {getPaginatedMeters().map(
                      (meterItem: Meter, index: number) => (
                        <MeterCard
                          key={`${meterItem.id}-${index}`}
                          meterItem={meterItem}
                        />
                      )
                    )}
                  </div>

                  {meters.length > pageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPage}
                        total={meters.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} meters`
                        }
                        size="small"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <IconHash size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No meters found</h5>
                  <p className="text-muted">
                    Try searching with a different keyword or add new meters.
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

      {/* Global Modal */}
      {modalState.isOpen && modalState.meterId && (
        <UpdateMeter
          id={modalState.meterId}
          meter_number={modalState.meterNumber || ""}
          is_synced_to_stron={modalState.isSynced || false}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MetersTable;

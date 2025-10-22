/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getCustomerMeters,
  CustomerMeter,
  getMeters,
  getCounties,
  Meter,
} from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Button,
  Spin,
  Table,
  Tooltip,
  Card,
  Pagination,
  Col,
  Badge,
} from "antd";
import { UpdateCustomerMeter } from ".";
import { Customer, getCustomers } from "../../features/customer/customerSlice";
import Select from "react-select";
import {
  IconDownload,
  IconRefresh,
  IconHash,
  IconCalendar,
  IconSettings,
} from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import { isMobile } from "react-device-detect";

const CustomerMetersTable = () => {
  const {
    customerMeters,
    loadingCustomerMeters,
    syncingCustomerMeterToStron,
    counties,
    meters,
  } = useSelector((state: RootState) => state.meter);
  const { customers } = useSelector((state: RootState) => state.customer);
  const dispatch = useDispatch<AppDispatch>();

  const [customer_id, setLandlord] = useState<any>(null);
  const [meter_id, setMeter] = useState<any>(null);
  const [county_number, setCounty] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 10 cards per page for mobile
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    customerMeterId: string | null | undefined;
    isSynced: boolean | null;
    custId: string | null | undefined;
    accountId: string | null | undefined;
    meterId: string | null | undefined;
  }>({
    isOpen: false,
    customerMeterId: null,
    isSynced: null,
    custId: null,
    accountId: null,
    meterId: null,
  });

  const displayCounties = counties.map((county: any) => {
    return { value: county?.code, label: county?.name };
  });
  const displayLandlords = customers.map((landlord: Customer) => {
    return {
      value: landlord?.id,
      label: `${landlord?.first_name} ${landlord?.middle_name} ${landlord?.last_name}`,
    };
  });
  const displayMeters = meters.map((meter: Meter) => {
    return { value: meter?.id, label: meter?.serial_number };
  });

  const dataSource = customerMeters.map((item: CustomerMeter) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      landlord: `${item?.Customer?.first_name} ${item?.Customer?.last_name}`,
      serial_number: `${
        item?.Meter?.county_number?.toString().length === 1 ? "C00" : "C0"
      }${item?.Meter?.county_number}-${item?.Meter?.serial_number}`,
      tenant: item?.Tenant?.first_name
        ? `${item?.Tenant?.first_name} ${item?.Tenant?.last_name}`
        : "N/A",
      is_synced_to_stron: item.is_synced_to_stron ? (
        <span className="text-success">Forwarded</span>
      ) : (
        <span className="text-danger">Not Forwarded</span>
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

  const downloadData = customerMeters.map((item: CustomerMeter) => {
    return {
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      landlord: `${item?.Customer?.first_name} ${item?.Customer?.last_name}`,
      serial_number: `${
        item?.Meter?.county_number?.toString().length === 1 ? "C00" : "C0"
      }${item?.Meter?.county_number}-${item?.Meter?.serial_number}`,
      tenant: item?.Tenant?.first_name
        ? `${item?.Tenant?.first_name} ${item?.Tenant?.last_name}`
        : "N/A",
      is_forwarded: item.is_synced_to_stron ? "Forwarded" : "Not Forwarded",
    };
  });

  const columns = [
    {
      title: "Meter Number",
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: "Landlord/Agent",
      dataIndex: "landlord",
      key: "landlord",
    },
    {
      title: "Is Forwarded",
      dataIndex: "is_synced_to_stron",
      key: "is_synced_to_stron",
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
    dispatch(getMeters(""));
    dispatch(getCustomers(""));
    dispatch(getCounties());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCustomerMeters());
  }, [dispatch, syncingCustomerMeterToStron]);

  useEffect(() => {
    let data = {
      meter_id: meter_id?.value ? meter_id?.value : "",
      customer_id: customer_id?.value ? customer_id?.value : "",
      county_number: county_number?.value ? county_number?.value : "",
    };
    dispatch(getCustomerMeters(data));
  }, [dispatch, meter_id?.value, customer_id?.value, county_number?.value]);

  const handleLandlordChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setLandlord(selectedOption);
    setMeter("");
  };

  const handleMeterChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setMeter(selectedOption);
    setLandlord("");
    setCounty("");
  };
  const handleCountyChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setCounty(selectedOption);
    setMeter("");
  };

  const refresh = () => {
    dispatch(getCustomerMeters());
    setLandlord("");
    setCounty("");
    setMeter("");
  };

  const openModal = (customerMeter: CustomerMeter) => {
    console.log("Opening modal for customer meter:", customerMeter.id);
    setModalState({
      isOpen: true,
      customerMeterId: customerMeter.id,
      isSynced: Boolean(customerMeter.is_synced_to_stron),
      custId: customerMeter?.Customer?.customer_number || null,
      accountId: customerMeter?.account_id || null,
      meterId: customerMeter?.Meter?.serial_number || null,
    });
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalState({
      isOpen: false,
      customerMeterId: null,
      isSynced: null,
      custId: null,
      accountId: null,
      meterId: null,
    });
  };

  // Mobile card component
  const CustomerMeterCard = ({
    customerMeterItem,
  }: {
    customerMeterItem: CustomerMeter;
  }) => (
    <Card
      className="mb-3 shadow-sm"
      style={{ borderRadius: "12px" }}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6 className="mb-1 fw-bold text-primary">
            {`C${
              customerMeterItem?.Meter?.county_number?.toString().length === 1
                ? "00"
                : "0"
            }${customerMeterItem?.Meter?.county_number}-${
              customerMeterItem?.Meter?.serial_number
            }`}
          </h6>
          <small className="fw-bold text-muted">
            Landlord:{" "}
            {`${customerMeterItem?.Customer?.first_name} ${customerMeterItem?.Customer?.last_name}`}
          </small>
        </div>
        <Badge
          color={customerMeterItem.is_synced_to_stron ? "green" : "red"}
          text={
            customerMeterItem.is_synced_to_stron ? "Forwarded" : "Not Forwarded"
          }
        />
      </div>

      <div className="d-flex flex-column gap-2">
        <Col span={24}>
          <div className="d-flex align-items-center mb-3">
            <IconCalendar size={16} className="text-warning me-2" />
            <div>
              <small className="text-muted d-block">Created</small>
              <span className="fw-bold text-warning">
                {moment(customerMeterItem.created_at).format("MMM DD, YYYY")}
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
            const originalCustomerMeter = customerMeters.find(
              (cm) => cm.id === customerMeterItem.id
            );
            if (originalCustomerMeter) openModal(originalCustomerMeter);
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
  const getPaginatedCustomerMeters = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return customerMeters.slice(startIndex, endIndex);
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
        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-8"
          } gap-3`}
        >
          <Select
            value={meter_id}
            onChange={(option) => handleMeterChange(option)}
            options={displayMeters}
            placeholder="Select a meter..."
            className={isMobile ? "w-100" : "col-md-2"}
          />
          <Select
            value={customer_id}
            onChange={(option) => handleLandlordChange(option)}
            options={displayLandlords}
            placeholder="Select a landlord..."
            className={isMobile ? "w-100" : "col-md-2"}
          />

          {!isMobile && (
            <Select
              value={county_number}
              onChange={(option) => handleCountyChange(option)}
              options={displayCounties}
              placeholder="Select county..."
              className={isMobile ? "w-100" : "col-md-2"}
            />
          )}
        </div>

        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-4"
          } gap-3`}
        >
          {!isMobile && (
            <div className="d-flex justify-content-center">
              <CSVLink
                data={downloadData}
                target="_blank"
                filename={
                  "Customer Meters" +
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
              className={`text-primary cursor ${isMobile ? "mt-2" : ""}`}
              onClick={() => refresh()}
              size={isMobile ? 20 : 24}
            />
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      {loadingCustomerMeters ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading customer meters...</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            // Mobile Card View
            <div>
              {getPaginatedCustomerMeters().length > 0 ? (
                <>
                  <div className="mb-3">
                    {getPaginatedCustomerMeters().map(
                      (customerMeterItem: CustomerMeter, index: number) => (
                        <CustomerMeterCard
                          key={`${customerMeterItem.id}-${index}`}
                          customerMeterItem={customerMeterItem}
                        />
                      )
                    )}
                  </div>

                  {customerMeters.length > pageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPage}
                        total={customerMeters.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} customer meters`
                        }
                        size="small"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <IconHash size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No customer meters found</h5>
                  <p className="text-muted">
                    Try selecting different filters or add new customer meters.
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
      {modalState.isOpen && modalState.customerMeterId && (
        <UpdateCustomerMeter
          id={modalState.customerMeterId}
          is_synced_to_stron={modalState.isSynced || false}
          CUST_ID={modalState.custId || undefined}
          Account_ID={modalState.accountId || undefined}
          METER_ID={modalState.meterId || undefined}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CustomerMetersTable;

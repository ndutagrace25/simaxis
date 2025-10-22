/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Table,
  Spin,
  Input,
  Tooltip,
  Button,
  Card,
  Pagination,
  Row,
  Col,
  Badge,
} from "antd";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Customer, getCustomers } from "../../features/customer/customerSlice";
import { useEffect, useState } from "react";
import moment from "moment";
import UpdateCustomer from "./UpdateCustomer";
import { appSession } from "../../utils/appStorage";
import {
  IconRefresh,
  IconDownload,
  IconMail,
  IconPhone,
  IconMapPin,
  IconHash,
  IconCalendar,
  IconPencil,
} from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import { isMobile } from "react-device-detect";

const AllCustomers = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 10 cards per page for mobile
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    customerId: string | null;
    customerName: string | null;
    isVerified: boolean | null;
    isSynced: boolean | null;
  }>({
    isOpen: false,
    customerId: null,
    customerName: null,
    isVerified: null,
    isSynced: null,
  });

  const { customers, loadingCustomers, veryfyingCustomer, updatingCustomer } =
    useSelector((state: RootState) => state.customer);
  const dispatch = useDispatch<AppDispatch>();
  const user = appSession.getUser();
  const token = appSession.getToken();

  const dataSource = customers.map((item: Customer) => {
    return {
      ...item,
      phone: item.User?.phone,
      email: item.User?.email,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      name: `${item.first_name} ${item.middle_name} ${item.last_name}`,
      is_verified: (
        <>
          {!item.is_verified ? (
            <span className="text-danger">Not verified</span>
          ) : (
            <>
              <span className="text-success">Verified</span>
            </>
          )}
        </>
      ),
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
            <IconPencil width={16} className="text-primary" />
          </Button>
        </>
      ),
    };
  });

  const downloadData = customers.map((item: Customer) => {
    return {
      phone: item.User?.phone,
      email: item.User?.email,
      first_name: item.first_name,
      middle_name: item.middle_name,
      last_name: item.last_name,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      name: `${item.first_name} ${item.middle_name} ${item.last_name}`,
    };
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID",
      dataIndex: "national_id",
      key: "national_id",
    },
    {
      title: "Address",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Is Verified",
      dataIndex: "is_verified",
      key: "is_verified",
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

  useEffect(
    () => {
      // @ts-ignore
      if (Object.keys(user).length > 0 && token) {
        console.log("Its here");
        dispatch(getCustomers(keyword));
      }
    },
    // @ts-ignore
    [
      dispatch,
      veryfyingCustomer,
      updatingCustomer,
      keyword,
      user ? Object.keys(user).length : 0,
      token,
    ]
  );

  const refresh = () => {
    dispatch(getCustomers(""));
    setKeyword("");
  };

  const openModal = (customer: Customer) => {
    console.log("Opening modal for customer:", customer.first_name);
    setModalState({
      isOpen: true,
      customerId: customer.id,
      customerName: `${customer.first_name} ${customer.middle_name} ${customer.last_name}`,
      isVerified: Boolean(customer.is_verified),
      isSynced: Boolean(customer.is_synced_to_stron),
    });
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalState({
      isOpen: false,
      customerId: null,
      customerName: null,
      isVerified: null,
      isSynced: null,
    });
  };

  // Mobile card component
  const CustomerCard = ({ customerItem }: { customerItem: Customer }) => (
    <Card
      className="mb-3 shadow-sm"
      style={{ borderRadius: "12px" }}
      styles={{ body: { padding: "16px" } }}
    >
      <div className="d-flex  justify-content-between align-items-start mb-3">
        <div>
          <div className="mb-1 fw-bold text-primary text-xs small">
            {`${customerItem.first_name} ${customerItem.middle_name} ${customerItem.last_name}`}
          </div>
          <small className="fw-bold text-muted">
            ID: {customerItem.national_id}
          </small>
        </div>
        <div className="d-flex flex-column gap-1">
          <Badge
            color={customerItem.is_verified ? "green" : "red"}
            text={customerItem.is_verified ? "Verified" : "Not Verified"}
          />
          <Badge
            color={customerItem.is_synced_to_stron ? "green" : "red"}
            text={
              customerItem.is_synced_to_stron ? "Forwarded" : "Not Forwarded"
            }
          />
        </div>
      </div>

      <Row gutter={[16, 8]}>
        <Col span={12}>
          <div className="d-flex align-items-center mb-2">
            <IconPhone size={16} className="text-info me-2" />
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
                {customerItem.User?.phone || "N/A"}
              </span>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="d-flex align-items-center mb-2">
            <IconMail size={16} className="text-primary me-2" />
            <div className="flex-grow-1">
              <small className="text-muted d-block">Email</small>
              <span
                className="fw-light text-primary d-block"
                style={{
                  wordBreak: "break-all",
                  fontSize: "0.7rem",
                  lineHeight: "1.2",
                }}
              >
                {customerItem.User?.email || "N/A"}
              </span>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div className="d-flex align-items-center mb-2">
            <IconMapPin size={16} className="text-warning me-2" />
            <div className="flex-grow-1">
              <small className="text-muted d-block">Address</small>
              <span
                className="fw-light text-warning d-block"
                style={{
                  wordBreak: "break-word",
                  fontSize: "0.7rem",
                  lineHeight: "1.2",
                }}
              >
                {customerItem.location || "N/A"}
              </span>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div className="d-flex align-items-center mb-3">
            <IconCalendar size={16} className="text-secondary me-2" />
            <div>
              <small className="text-muted d-block">Created</small>
              <span className="fw-bold text-secondary">
                {moment(customerItem.created_at).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button
          type="text"
          size="small"
          onClick={() => {
            const originalCustomer = customers.find(
              (c) => c.id === customerItem.id
            );
            if (originalCustomer) openModal(originalCustomer);
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
          <IconPencil width={16} className="text-primary" />
        </Button>
      </div>
    </Card>
  );

  // Pagination logic for mobile
  const getPaginatedCustomers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return customers.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Header Controls */}
      <div
        className={`d-flex ${
          isMobile ? "flex-column" : "justify-content-between"
        } mb-3`}
      >
        <div className={`${isMobile ? "mb-3" : "col-md-6"}`}>
          <Input
            className={isMobile ? "w-100" : "col-md-5"}
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
                  "Landlords/Agents" +
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
      {loadingCustomers || veryfyingCustomer ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading customers...</p>
        </div>
      ) : (
        <>
          {isMobile ? (
            // Mobile Card View
            <div>
              {getPaginatedCustomers().length > 0 ? (
                <>
                  <div className="mb-3">
                    {getPaginatedCustomers().map(
                      (customerItem: Customer, index: number) => (
                        <CustomerCard
                          key={`${customerItem.id}-${index}`}
                          customerItem={customerItem}
                        />
                      )
                    )}
                  </div>

                  {customers.length > pageSize && (
                    <div className="text-center mt-4">
                      <Pagination
                        current={currentPage}
                        total={customers.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} customers`
                        }
                        size="small"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <IconHash size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No customers found</h5>
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

      {/* Global Modal */}
      {modalState.isOpen && modalState.customerId && (
        <UpdateCustomer
          customer_name={modalState.customerName || ""}
          is_synced_to_stron={modalState.isSynced || false}
          id={modalState.customerId}
          is_verified={modalState.isVerified || false}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AllCustomers;

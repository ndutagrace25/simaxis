/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../utils/axios";
import moment from "moment";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tooltip,
} from "antd";
import { IconRefresh, IconDownload, IconPlus } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";
import Swal from "sweetalert2";

interface EsperanzaPayment {
  id: string;
  payment_date: string;
  amount: number;
  payment_mode: string;
  reference?: string;
  created_at?: string;
  created_by_name?: string | null;
  updated_at?: string;
  updated_by_name?: string | null;
}

const PAGE_SIZE_OPTIONS = ["10", "50", "100"];
const PAYMENT_MODE_OPTIONS = ["Cash", "Cheque", "Mpesa", "Bank Transfer"].map(
  (value) => ({ value, label: value })
);

const buildParams = (keyword: string, startDate: string, endDate: string) => {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  return params;
};

const EsperanzaPaymentsTable = () => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payments, setPayments] = useState<EsperanzaPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams(keyword, startDate, endDate);
      params.set("page", String(page));
      params.set("limit", String(pageSize));
      const response = await axiosInstance.get(
        `/esperanza-payments?${params.toString()}`
      );
      setPayments(response.data.payments || []);
      setTotal(response.data.total || 0);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        window.location.href = "/";
        return;
      }
      Swal.fire(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [keyword, startDate, endDate, page, pageSize]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const refresh = () => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ payment_date: dayjs() });
    setCreateOpen(true);
  };

  const handleCreate = async (values: any) => {
    setSaving(true);
    try {
      await axiosInstance.post("/esperanza-payments", {
        payment_date: values.payment_date.format("YYYY-MM-DD"),
        amount: values.amount,
        payment_mode: values.payment_mode,
        reference: values.reference?.trim() || undefined,
      });
      setCreateOpen(false);
      Swal.fire("Success", "Payment saved successfully", "success");
      // show the new record at the top of the unfiltered list
      if (page === 1 && !keyword && !startDate && !endDate) {
        fetchPayments();
      } else {
        refresh();
      }
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      const params = buildParams(keyword, startDate, endDate);
      const response = await axiosInstance.get(
        `/esperanza-payments/export?${params.toString()}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        "Esperanza_Payments_" +
        moment(new Date()).format("DD-MM-YYYY_HH-mm-ss") +
        ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      // with responseType "blob" the error body is a Blob too
      let message = error.message;
      try {
        const body = JSON.parse(await error?.response?.data?.text());
        message = body?.message || message;
      } catch {
        // keep the default message
      }
      Swal.fire("Error", message, "error");
    } finally {
      setDownloadingCsv(false);
    }
  };

  const columns = [
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (value: string) => moment(value).format("MM/DD/YYYY"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `KES ${value}`,
    },
    {
      title: "Payment Mode",
      dataIndex: "payment_mode",
      key: "payment_mode",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (value?: string) => value || "-",
    },
    {
      title: "Created By",
      dataIndex: "created_by_name",
      key: "created_by_name",
      render: (value?: string | null) => value || "-",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value?: string) =>
        value ? moment(value).format("MM/DD/YYYY HH:mm") : "-",
    },
    {
      title: "Updated By",
      dataIndex: "updated_by_name",
      key: "updated_by_name",
      render: (value?: string | null) => value || "-",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (value?: string) =>
        value ? moment(value).format("MM/DD/YYYY HH:mm") : "-",
    },
  ];

  return (
    <div className="mt-3">
      <div
        className={`d-flex ${
          isMobile ? "flex-column" : "justify-content-between col-md-12"
        } mb-3`}
      >
        <div className={`${isMobile ? "mb-3" : "col-md-5"}`}>
          <Input
            className={isMobile ? "w-100" : "col-md-12"}
            placeholder="Search by reference or mode"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
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
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              max={endDate || undefined}
            />
          </div>

          <div className={isMobile ? "w-100" : "col-md-3"}>
            <small className="text-muted d-block mb-1">End Date</small>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              min={startDate || undefined}
            />
          </div>

          <div className="d-flex justify-content-center gap-2">
            <Button
              type="primary"
              className={isMobile ? "w-100" : undefined}
              onClick={openCreate}
            >
              <span className="me-2">Add Payment</span>
              <IconPlus width={16} />
            </Button>
            <Button
              type="dashed"
              size="middle"
              className={isMobile ? "w-100" : undefined}
              loading={downloadingCsv}
              onClick={handleDownloadCsv}
            >
              <span className="me-2">Download CSV</span>
              <IconDownload width={16} />
            </Button>
          </div>

          <Tooltip title="refresh data">
            <IconRefresh
              className="text-primary cursor"
              onClick={refresh}
              size={24}
            />
          </Tooltip>
        </div>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={payments}
        columns={columns}
        scroll={isMobile ? { x: true } : undefined}
        pagination={{
          current: page,
          total,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onChange: (nextPage, nextSize) => {
            if (nextSize !== pageSize) {
              setPageSize(nextSize);
              setPage(1);
            } else {
              setPage(nextPage);
            }
          },
        }}
      />

      <Modal
        title="Add Esperanza Payment"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
        confirmLoading={saving}
        destroyOnClose
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="payment_date"
            label="Payment Date"
            rules={[{ required: true, message: "Payment date is required" }]}
          >
            <DatePicker
              className="w-100"
              format="MM/DD/YYYY"
              disabledDate={(current) => current.isAfter(dayjs(), "day")}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount (KES)"
            rules={[
              { required: true, message: "Amount is required" },
              {
                type: "number",
                min: 0.01,
                message: "Amount must be greater than 0",
              },
            ]}
          >
            <InputNumber className="w-100" min={0} controls={false} />
          </Form.Item>
          <Form.Item
            name="payment_mode"
            label="Payment Mode"
            rules={[{ required: true, message: "Payment mode is required" }]}
          >
            <Select
              options={PAYMENT_MODE_OPTIONS}
              placeholder="Select a payment mode"
            />
          </Form.Item>
          <Form.Item name="reference" label="Reference (optional)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EsperanzaPaymentsTable;

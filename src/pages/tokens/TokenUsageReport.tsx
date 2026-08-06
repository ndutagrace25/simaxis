/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import axiosInstance from "../../utils/axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Spin, Table, Tooltip } from "antd";
import {
  getTokenUsageReport,
  TokenUsageReportRow,
} from "../../features/tokens/tokenUsageReportSlice";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import Select from "react-select";
import { isMobile } from "react-device-detect";
import Swal from "sweetalert2";

const PAGE_SIZE_OPTIONS = ["10", "50", "100"];

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, index) => ({ value: index + 1, label }));

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, index) => CURRENT_YEAR - index);

const customerName = (row: TokenUsageReportRow) => {
  const name = [row.first_name, row.middle_name, row.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || "N/A";
};

const TokenUsageReport = () => {
  const { report, loadingReport, totalMeters, currentPage, pageSize } =
    useSelector((state: RootState) => state.tokenUsageReport);
  const { meters } = useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();

  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [meter_id, setMeter] = useState<any>(null);
  const [reportPage, setReportPage] = useState(1);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const monthOptions =
    year === CURRENT_YEAR
      ? MONTH_OPTIONS.filter((option) => option.value <= new Date().getMonth() + 1)
      : MONTH_OPTIONS;

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
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
    },
    {
      title: "Total Units",
      dataIndex: "total_units",
      key: "total_units",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Token Count",
      dataIndex: "token_count",
      key: "token_count",
    },
  ];

  const dataSource = report.map((item: TokenUsageReportRow) => {
    return {
      ...item,
      customer_name: customerName(item),
      categories: item.categories || "N/A",
      total_units: `${Number(item.total_units).toFixed(2)} KWh`,
      total_amount: `KES ${Number(item.total_amount).toFixed(2)}`,
    };
  });

  useEffect(() => {
    dispatch(
      getTokenUsageReport({
        month,
        year,
        meterId: meter_id?.value || "",
        page: reportPage,
        limit: pageSize,
      })
    );
  }, [dispatch, month, year, meter_id?.value, pageSize, reportPage]);

  useEffect(() => {
    dispatch(getMeters(""));
  }, [dispatch]);

  const handleMeterChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setMeter(selectedOption);
    setReportPage(1);
  };

  const handleYearChange = (value: number) => {
    const currentMonth = new Date().getMonth() + 1;
    setYear(value);
    if (value === CURRENT_YEAR && month > currentMonth) {
      setMonth(currentMonth);
    }
    setReportPage(1);
  };

  const handleMonthChange = (value: number) => {
    setMonth(value);
    setReportPage(1);
  };

  const refresh = () => {
    setMeter(null);
    setYear(CURRENT_YEAR);
    setMonth(new Date().getMonth() + 1);
    setReportPage(1);
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);

    try {
      const params = new URLSearchParams();

      params.set("month", String(month));
      params.set("year", String(year));

      if (meter_id?.value) {
        params.set("meter_id", meter_id.value);
      }

      params.set("export_all", "true");

      const response = await axiosInstance.get(
        `/tokens/monthly-report?${params.toString()}`
      );
      const exportRows: TokenUsageReportRow[] = response.data.data || [];

      if (!exportRows.length) {
        Swal.fire("Info", "No data available for the selected filter.", "info");
        return;
      }

      const headers = [
        "Meter Number",
        "Customer Name",
        "Category",
        "Total Units",
        "Total Amount",
        "Token Count",
      ];
      const rows = exportRows.map((item) => [
        item.serial_number,
        customerName(item),
        item.categories || "N/A",
        Number(item.total_units).toFixed(2),
        Number(item.total_amount).toFixed(2),
        item.token_count,
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
      link.download = `TokenUsageReport_${year}-${String(month).padStart(
        2,
        "0"
      )}_${moment(new Date()).format("DD-MM-YYYY_HH-mm-ss")}.csv`;
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

  const handlePageChange = (page: number, nextPageSize?: number) => {
    if (nextPageSize && nextPageSize !== pageSize) {
      setReportPage(1);
      dispatch(
        getTokenUsageReport({
          month,
          year,
          meterId: meter_id?.value || "",
          page: 1,
          limit: nextPageSize,
        })
      );
      return;
    }

    setReportPage(page);
  };

  return (
    <div className="mt-3">
      <div
        className={`d-flex ${
          isMobile ? "flex-column" : "justify-content-end"
        } mb-3`}
      >
        <div
          className={`d-flex ${
            isMobile ? "flex-column" : "align-items-center col-md-8"
          } gap-3`}
        >
          <div className={isMobile ? "w-100" : "col-md-3"}>
            <small className="text-muted d-block mb-1">Year</small>
            <select
              className="form-select"
              value={year}
              onChange={(event) => handleYearChange(Number(event.target.value))}
            >
              {YEAR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={isMobile ? "w-100" : "col-md-3"}>
            <small className="text-muted d-block mb-1">Month</small>
            <select
              className="form-select"
              value={month}
              onChange={(event) => handleMonthChange(Number(event.target.value))}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={isMobile ? "w-100" : "col-md-4"}>
            <small className="text-muted d-block mb-1">Meter</small>
            <Select
              value={meter_id}
              onChange={(option) => handleMeterChange(option)}
              options={displayMeters}
              placeholder="Search a meter..."
              className="w-100"
              isClearable
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

      {loadingReport ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading report...</p>
        </div>
      ) : (
        <Table
          rowKey="meter_id"
          dataSource={dataSource}
          columns={columns}
          scroll={isMobile ? { x: true } : undefined}
          pagination={{
            current: currentPage,
            total: totalMeters,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
        />
      )}
    </div>
  );
};

export default TokenUsageReport;

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect, useState } from "react";
import { Spin, Table, Tooltip } from "antd";
import {
  getWebsiteTokenCheckSummary,
  WebsiteTokenCheckSummaryRow,
} from "../../features/tokens/websiteTokenChecksSlice";
import { IconRefresh } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";

const PAGE_SIZE_OPTIONS = ["10", "50", "100"];

const WebsiteTokenChecksTable = () => {
  const { summary, loadingSummary, totalMeters, currentPage, pageSize } =
    useSelector((state: RootState) => state.websiteTokenChecks);
  const dispatch = useDispatch<AppDispatch>();

  const [reportPage, setReportPage] = useState(1);

  const columns = [
    {
      title: "Meter Number",
      dataIndex: "meter_number",
      key: "meter_number",
    },
    {
      title: "Number of Checks",
      dataIndex: "number_of_checks",
      key: "number_of_checks",
    },
    {
      title: "Last Check",
      dataIndex: "last_check",
      key: "last_check",
    },
  ];

  const dataSource = summary.map((item: WebsiteTokenCheckSummaryRow) => {
    return {
      ...item,
      last_check: moment(item.last_check).format("YYYY/MM/D HH:mm"),
    };
  });

  useEffect(() => {
    dispatch(getWebsiteTokenCheckSummary({ page: reportPage, limit: pageSize }));
  }, [dispatch, reportPage, pageSize]);

  const refresh = () => {
    setReportPage(1);
    dispatch(getWebsiteTokenCheckSummary({ page: 1, limit: pageSize }));
  };

  const handlePageChange = (page: number, nextPageSize?: number) => {
    if (nextPageSize && nextPageSize !== pageSize) {
      setReportPage(1);
      dispatch(
        getWebsiteTokenCheckSummary({ page: 1, limit: nextPageSize })
      );
      return;
    }

    setReportPage(page);
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-end mb-3">
        <Tooltip title="refresh data">
          <IconRefresh
            className="text-primary cursor"
            onClick={() => refresh()}
            size={24}
          />
        </Tooltip>
      </div>

      {loadingSummary ? (
        <div className="text-center py-5">
          <Spin size="large" />
          <p className="mt-3 text-muted">Loading website token checks...</p>
        </div>
      ) : (
        <Table
          rowKey="meter_number"
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

export default WebsiteTokenChecksTable;

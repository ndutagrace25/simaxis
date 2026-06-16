import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  TooltipProps,
} from "recharts";
import { getRevenueData } from "../../features/payment/paymentSlice";
import { RootState } from "../../store";

// Type definitions
interface ChartDataItem {
  period: string;
  fullDate: string;
  revenue: number;
  formattedRevenue: string;
  kplc: number;
  siMaxis: number;
  esperanza: number;
  formattedKplc: string;
  formattedSiMaxis: string;
  formattedEsperanza: string;
}

type FilterType = "daily" | "monthly" | "yearly";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    value: number;
  }>;
  label?: string;
}

const RevenueChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { revenue, loadingRevenue } = useSelector(
    (state: RootState) => state.payment
  );
  const [filterType, setFilterType] = useState<FilterType>("daily");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Transform revenue data for chart
  const chartData: ChartDataItem[] = revenue.map((item) => {
    const year = parseInt(item.date.substring(0, 4));
    const isSplitYear = year >= 2025;
    
    return {
      period: item.period,
      fullDate: item.date,
      revenue: isSplitYear ? 0 : item.revenue,
      formattedRevenue: `KES ${item.revenue.toLocaleString()}`,
      kplc: isSplitYear ? (item.kplc || 0) : 0,
      siMaxis: isSplitYear ? (item.siMaxis || 0) : 0,
      esperanza: isSplitYear ? (item.esperanza || 0) : 0,
      formattedKplc: `KES ${(item.kplc || 0).toLocaleString()}`,
      formattedSiMaxis: `KES ${(item.siMaxis || 0).toLocaleString()}`,
      formattedEsperanza: `KES ${(item.esperanza || 0).toLocaleString()}`,
    };
  });

  // Update chart data when filter type or date changes
  useEffect(() => {
    dispatch(getRevenueData({ filterType, selectedDate }));
  }, [dispatch, filterType, selectedDate]);

  // Get current period label
  const getCurrentPeriodLabel = (): string => {
    const dateObj = new Date(selectedDate);

    switch (filterType) {
      case "daily":
        return dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      case "monthly":
        return dateObj.getFullYear().toString();
      case "yearly":
        return "Last 5 Years";
      default:
        return "";
    }
  };

  // Calculate total revenue from original data
  const totalRevenue: number = revenue.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  // Calculate split totals from original data
  const totalKplc: number = revenue.reduce((sum, item) => sum + (item.kplc || 0), 0);
  const totalSiMaxis: number = revenue.reduce(
    (sum, item) => sum + (item.siMaxis || 0),
    0
  );
  const totalEsperanza: number = revenue.reduce(
    (sum, item) => sum + (item.esperanza || 0),
    0
  );

  // Custom tooltip for the chart
  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="mb-2 font-weight-bold">
            {`${
              filterType === "daily"
                ? "Day"
                : filterType === "monthly"
                ? "Month"
                : "Year"
            }: ${label}`}
          </p>
          <p className="mb-1 text-success">{`Total: ${data.formattedRevenue}`}</p>
          <p className="mb-1" style={{ color: "#8b5cf6" }}>{`KPLC (90%): ${data.formattedKplc}`}</p>
          <p className="mb-1" style={{ color: "#06b6d4" }}>{`SI-MAXIS (8.5%): ${data.formattedSiMaxis}`}</p>
          <p className="mb-0" style={{ color: "#f59e0b" }}>{`ESPERANZA (1.5%): ${data.formattedEsperanza}`}</p>
        </div>
      );
    }
    return null;
  };

  // Handle filter type change
  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFilterType(event.target.value as FilterType);
  };

  // Handle date change
  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    if (filterType === "daily") {
      setSelectedDate(value + "-01");
    } else {
      setSelectedDate(value + "-01-01");
    }
  };

  // Get input value for date picker
  const getInputValue = (): string | number => {
    if (filterType === "daily") {
      return selectedDate.substring(0, 7);
    } else if (filterType === "monthly") {
      return new Date(selectedDate).getFullYear();
    }
    return "Last 5 Years";
  };

  // Get input type for date picker
  const getInputType = (): string => {
    if (filterType === "daily") return "month";
    if (filterType === "monthly") return "number";
    return "text";
  };

  // Get label for date picker
  const getDateLabel = (): string => {
    switch (filterType) {
      case "daily":
        return "Select Month:";
      case "monthly":
        return "Select Year:";
      default:
        return "Period:";
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">Revenue Reports</h4>
            </div>
            <div className="card-body">
              {/* Filter Controls */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Report Type:</label>
                  <select
                    className="form-select"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                  >
                    <option value="daily">Daily Revenue</option>
                    <option value="monthly">Monthly Revenue</option>
                    <option value="yearly">Yearly Revenue</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">{getDateLabel()}</label>
                  {filterType !== "yearly" ? (
                    <input
                      type={getInputType()}
                      className="form-control"
                      value={getInputValue()}
                      onChange={handleDateChange}
                      min={filterType === "monthly" ? 2020 : undefined}
                      max={
                        filterType === "monthly"
                          ? new Date().getFullYear()
                          : undefined
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value="Last 5 Years"
                      readOnly
                    />
                  )}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="row mb-4 g-3">
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body p-3">
                      <h6 className="card-title mb-2 fs-6">Total Revenue</h6>
                      <div className="fs-7 fw-bold">KES {totalRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="card text-white h-100" style={{ backgroundColor: "#8b5cf6" }}>
                    <div className="card-body p-3">
                      <h6 className="card-title mb-2 fs-6">KPLC (90%)</h6>
                      <div className="fs-7 fw-bold">
                        KES {totalKplc.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="card text-white h-100" style={{ backgroundColor: "#06b6d4" }}>
                    <div className="card-body p-3">
                      <h6 className="card-title mb-2 fs-6">SI-MAXIS (8.5%)</h6>
                      <div className="fs-7 fw-bold">
                        KES {totalSiMaxis.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="card text-white h-100" style={{ backgroundColor: "#f59e0b" }}>
                    <div className="card-body p-3">
                      <h6 className="card-title mb-2 fs-6">ESPERANZA (1.5%)</h6>
                      <div className="fs-7 fw-bold">
                        KES {totalEsperanza.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">
                        {filterType.charAt(0).toUpperCase() +
                          filterType.slice(1)}{" "}
                        Revenue for {getCurrentPeriodLabel()}
                      </h5>
                    </div>
                    <div className="card-body">
                      {loadingRevenue ? (
                        <div className="text-center py-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2">Loading chart data...</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="period"
                              tick={{ fontSize: 12 }}
                              interval={
                                filterType === "daily"
                                  ? Math.floor(chartData.length / 10)
                                  : 0
                              }
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value: number) =>
                                `KES ${(value / 1000).toFixed(0)}K`
                              }
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                              dataKey="revenue"
                              fill="#007bff"
                              name="Revenue (2024)"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="kplc"
                              fill="#8b5cf6"
                              name="KPLC (90%)"
                              stackId="a"
                            />
                            <Bar
                              dataKey="siMaxis"
                              fill="#06b6d4"
                              name="SI-MAXIS (8.5%)"
                              stackId="a"
                            />
                            <Bar
                              dataKey="esperanza"
                              fill="#f59e0b"
                              name="ESPERANZA (1.5%)"
                              stackId="a"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Revenue Data</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead className="table-dark">
                            <tr>
                              <th>
                                {filterType === "daily"
                                  ? "Day"
                                  : filterType === "monthly"
                                  ? "Month"
                                  : "Year"}
                              </th>
                              <th>Total Revenue</th>
                              <th style={{ color: "#8b5cf6" }}>KPLC (90%)</th>
                              <th style={{ color: "#06b6d4" }}>SI-MAXIS (8.5%)</th>
                              <th style={{ color: "#f59e0b" }}>ESPERANZA (1.5%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chartData.map(
                              (item: ChartDataItem, index: number) => (
                                <tr key={index}>
                                  <td className="fw-bold">{item.period}</td>
                                  <td className="text-success fw-bold">
                                    {item.formattedRevenue}
                                  </td>
                                  <td style={{ color: "#8b5cf6" }} className="fw-bold">
                                    {item.formattedKplc}
                                  </td>
                                  <td style={{ color: "#06b6d4" }} className="fw-bold">
                                    {item.formattedSiMaxis}
                                  </td>
                                  <td style={{ color: "#f59e0b" }} className="fw-bold">
                                    {item.formattedEsperanza}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;

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
  const chartData: ChartDataItem[] = revenue.map((item) => ({
    period: item.period,
    fullDate: item.date,
    revenue: item.revenue,
    formattedRevenue: `KES ${item.revenue.toLocaleString()}`,
  }));

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

  // Calculate total revenue
  const totalRevenue: number = chartData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  // Get bar color based on filter type
  const getBarColor = (): string => {
    switch (filterType) {
      case "daily":
        return "#007bff";
      case "monthly":
        return "#28a745";
      case "yearly":
        return "#ffc107";
      default:
        return "#007bff";
    }
  };

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
          <p className="mb-1 font-weight-bold">
            {`${
              filterType === "daily"
                ? "Day"
                : filterType === "monthly"
                ? "Month"
                : "Year"
            }: ${label}`}
          </p>
          <p className="mb-0 text-success">{`Revenue: ${data.formattedRevenue}`}</p>
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
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Revenue</h5>
                      <h3 className="mb-0">KES {totalRevenue.toLocaleString()}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <h5 className="card-title">Period</h5>
                      <h6 className="mb-0">{getCurrentPeriodLabel()}</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <h5 className="card-title">Data Points</h5>
                      <h3 className="mb-0">{chartData.length}</h3>
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
                              fill={getBarColor()}
                              name={`${
                                filterType.charAt(0).toUpperCase() +
                                filterType.slice(1)
                              } Revenue`}
                              radius={[4, 4, 0, 0]}
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
                              <th>Revenue</th>
                              <th>Percentage of Total</th>
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
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div
                                        className="progress flex-grow-1 me-2"
                                        style={{ height: "20px" }}
                                      >
                                        <div
                                          className="progress-bar bg-success"
                                          role="progressbar"
                                          style={{
                                            width: `${(
                                              (item.revenue / totalRevenue) *
                                              100
                                            ).toFixed(1)}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <small className="text-muted">
                                        {(
                                          (item.revenue / totalRevenue) *
                                          100
                                        ).toFixed(1)}
                                        %
                                      </small>
                                    </div>
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

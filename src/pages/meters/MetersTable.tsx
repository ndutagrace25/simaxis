import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Input, Spin, Table, Tooltip } from "antd";
import { AddMeter, UpdateMeter } from ".";
import { CSVLink } from "react-csv";
import { IconDownload, IconRefresh } from "@tabler/icons-react";

const MetersTable = () => {
  const [keyword, setKeyword] = useState<string>("");

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
          <UpdateMeter
            id={item.id}
            meter_number={`${item.county_number}-${item.serial_number}`}
            is_synced_to_stron={item.is_synced_to_stron}
          />
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
    clearingMeterCredit,
    clearingMeterTamper,
    savingMeter,
    syncingMeterToStron,
    keyword,
  ]);

  const refresh = () => {
    dispatch(getMeters(""));
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <AddMeter />
        <Input
          className="col-md-2"
          placeholder="Search meter number..."
          value={keyword}
          onChange={(e: any) => setKeyword(e.target.value)}
          name="keyword"
        />
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
            <Button type="dashed">
              <span className="me-2">Download</span>
              <span>
                <IconDownload width={16} />
              </span>
            </Button>
          </CSVLink>
        </div>
        <Tooltip title="refresh data">
          <IconRefresh
            className="text-primary cursor"
            onClick={() => refresh()}
          />
        </Tooltip>
      </div>
      {loadingMeters ||
      syncingMeterToStron ||
      clearingMeterTamper ||
      clearingMeterCredit ? (
        <Spin />
      ) : (
        <>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </div>
  );
};

export default MetersTable;

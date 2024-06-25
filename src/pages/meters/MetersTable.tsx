import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";
import { UpdateMeter } from ".";

const MetersTable = () => {
  const {
    meters,
    loadingMeters,
    savingMeter,
    syncingMeterToStron,
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
    dispatch(getMeters());
  }, [clearingMeterTamper, savingMeter, syncingMeterToStron]);

  return (
    <div className="mt-3">
      {loadingMeters || syncingMeterToStron || clearingMeterTamper ? (
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

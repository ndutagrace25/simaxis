import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";
import { UpdateMeter } from ".";

const MetersTable = () => {
  const { meters, loadingMeters, savingMeter, syncingMeterToStron } =
    useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = meters.map((item: Meter) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      type: item.MeterType.name,
      serial_number: `${item.county_number}-${item.serial_number}`,
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
          {!item.is_synced_to_stron ? (
            <>
              <UpdateMeter
                id={item.id}
                meter_number={`${item.county_number}-${item.serial_number}`}
                is_synced_to_stron={item.is_synced_to_stron}
              />
            </>
          ) : null}
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
  }, [savingMeter, syncingMeterToStron]);

  return (
    <div className="mt-3">
      {loadingMeters || syncingMeterToStron ? (
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

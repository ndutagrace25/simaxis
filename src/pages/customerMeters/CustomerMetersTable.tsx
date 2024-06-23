import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getCustomerMeters,
  CustomerMeter,
} from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";
import { UpdateCustomerMeter } from ".";

const CustomerMetersTable = () => {
  const { customerMeters, loadingCustomerMeters } = useSelector(
    (state: RootState) => state.meter
  );
  const dispatch = useDispatch<AppDispatch>();

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
          <UpdateCustomerMeter
            id={item.id}
            is_synced_to_stron={item.is_synced_to_stron}
            CUST_ID={item?.Customer?.customer_number}
            Account_ID={item?.account_id}
            METER_ID={item?.Meter?.serial_number}
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
      title: "Landlord/Agent",
      dataIndex: "landlord",
      key: "landlord",
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
      key: "tenant",
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
    dispatch(getCustomerMeters());
  }, []);

  return (
    <div className="mt-3">
      {loadingCustomerMeters ? (
        <Spin />
      ) : (
        <>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </div>
  );
};

export default CustomerMetersTable;

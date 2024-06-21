import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getCustomerMeters,
  CustomerMeter,
} from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";

const CustomerMetersTable = () => {
  const { customerMeters, loadingCustomerMeters } = useSelector(
    (state: RootState) => state.meter
  );
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = customerMeters.map((item: CustomerMeter) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      landlord: `${item.Customer.first_name} ${item.Customer.last_name}`,
      serial_number: `${
        item.Meter.county_number.toString().length === 1 ? "C00" : "C0"
      }${item.Meter.county_number}-${item.Meter.serial_number}`,
      tenant: item?.Tenant?.first_name
        ? `${item?.Tenant?.first_name} ${item?.Tenant?.last_name}`
        : "N/A",
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
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
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

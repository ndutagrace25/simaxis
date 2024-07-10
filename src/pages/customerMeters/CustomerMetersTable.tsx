import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getCustomerMeters,
  CustomerMeter,
  getMeters,
  getCounties,
  Meter,
} from "../../features/meter/meterSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Spin, Table, Tooltip } from "antd";
import { UpdateCustomerMeter } from ".";
import { Customer, getCustomers } from "../../features/customer/customerSlice";
import Select from "react-select";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { CSVLink } from "react-csv";

const CustomerMetersTable = () => {
  const {
    customerMeters,
    loadingCustomerMeters,
    syncingCustomerMeterToStron,
    counties,
    meters,
  } = useSelector((state: RootState) => state.meter);
  const { customers } = useSelector((state: RootState) => state.customer);
  const dispatch = useDispatch<AppDispatch>();

  const [customer_id, setLandlord] = useState<any>(null);

  const displayCounties = counties.map((county: any) => {
    return { value: county?.code, label: county?.name };
  });
  const displayLandlords = customers.map((landlord: Customer) => {
    return {
      value: landlord?.id,
      label: `${landlord?.first_name} ${landlord?.middle_name} ${landlord?.last_name}`,
    };
  });
  const displayMeters = meters.map((meter: Meter) => {
    return { value: meter?.id, label: meter?.serial_number };
  });

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

  const downloadData = customerMeters.map((item: CustomerMeter) => {
    return {
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      landlord: `${item?.Customer?.first_name} ${item?.Customer?.last_name}`,
      serial_number: `${
        item?.Meter?.county_number?.toString().length === 1 ? "C00" : "C0"
      }${item?.Meter?.county_number}-${item?.Meter?.serial_number}`,
      tenant: item?.Tenant?.first_name
        ? `${item?.Tenant?.first_name} ${item?.Tenant?.last_name}`
        : "N/A",
      is_forwarded: item.is_synced_to_stron
        ? "Forwarded"
        : "Not Forwarded",
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
    dispatch(getMeters(""));
    dispatch(getCustomers(""));
    dispatch(getCounties());
  }, []);

  useEffect(() => {
    dispatch(getCustomerMeters());
  }, [syncingCustomerMeterToStron]);

  const handleLandlordChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setLandlord(selectedOption);
  };

  const refresh = () => {
    dispatch(getCustomerMeters());
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <Select
          value={customer_id}
          onChange={(option) => handleLandlordChange(option)}
          options={displayMeters}
          placeholder="Select a meter..."
          className="col-md-2"
        />
        <Select
          value={customer_id}
          onChange={(option) => handleLandlordChange(option)}
          options={displayLandlords}
          placeholder="Select a landlord..."
          className="col-md-2"
        />

        <Select
          value={customer_id}
          onChange={(option) => handleLandlordChange(option)}
          options={displayCounties}
          placeholder="Select county..."
          className="col-md-2"
        />
        <div className="d-flex justify-content-center">
          <CSVLink
            data={downloadData}
            target="_blank"
            filename={
              "Customer Meters" +
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

import { Table, Spin } from "antd";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Customer, getCustomers } from "../../features/customer/customerSlice";
import { useEffect } from "react";
import moment from "moment";
import UpdateCustomer from "./UpdateCustomer";
import { appSession } from "../../utils/appStorage";

const AllCustomers = () => {
  const { customers, loadingCustomers, veryfyingCustomer, updatingCustomer } =
    useSelector((state: RootState) => state.customer);
  const dispatch = useDispatch<AppDispatch>();
  const user = appSession.getUser();
  const token = appSession.getToken();

  const dataSource = customers.map((item: Customer) => {
    return {
      ...item,
      phone: item.User?.phone,
      email: item.User?.email,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      name: `${item.first_name} ${item.middle_name} ${item.last_name}`,
      is_verified: (
        <>
          {!item.is_verified ? (
            <span className="text-danger">Not verified</span>
          ) : (
            <>
              <span className="text-success">Verified</span>
            </>
          )}
        </>
      ),
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
          <UpdateCustomer
            customer_name={`${item.first_name} ${item.middle_name} ${item.last_name}`}
            is_synced_to_stron={item.is_synced_to_stron}
            id={item.id}
            is_verified={item.is_verified}
          />
        </>
      ),
    };
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID",
      dataIndex: "national_id",
      key: "national_id",
    },
    {
      title: "Address",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Is Verified",
      dataIndex: "is_verified",
      key: "is_verified",
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

  useEffect(
    () => {
      // @ts-ignore
      if (Object.keys(user).length > 0 && token) {
        dispatch(getCustomers());
      }
    },
    // @ts-ignore
    [veryfyingCustomer, Object.keys(user).length, token, updatingCustomer]
  );

  return (
    <div>
      {loadingCustomers || veryfyingCustomer ? (
        <Spin />
      ) : (
        <Table dataSource={dataSource} columns={columns} />
      )}
    </div>
  );
};

export default AllCustomers;

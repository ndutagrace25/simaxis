import { Table, Spin, Input, Tooltip, Button } from "antd";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Customer, getCustomers } from "../../features/customer/customerSlice";
import { useEffect, useState } from "react";
import moment from "moment";
import UpdateCustomer from "./UpdateCustomer";
import { appSession } from "../../utils/appStorage";
import { IconRefresh, IconDownload } from "@tabler/icons-react";
import { CSVLink } from "react-csv";

const AllCustomers = () => {
  const [keyword, setKeyword] = useState<string>("");
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

  const downloadData = customers.map((item: Customer) => {
    return {
      phone: item.User?.phone,
      email: item.User?.email,
      first_name: item.first_name,
      middle_name: item.middle_name,
      last_name: item.last_name,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      name: `${item.first_name} ${item.middle_name} ${item.last_name}`,
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
        dispatch(getCustomers(keyword));
      }
    },
    // @ts-ignore
    [
      veryfyingCustomer,
      // @ts-ignore
      Object.keys(user).length,
      token,
      updatingCustomer,
      keyword,
    ]
  );

  const refresh = () => {
    dispatch(getCustomers(""));
    setKeyword("");
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Input
          className="col-md-2"
          placeholder="Search...(if phone 254..)"
          value={keyword}
          onChange={(e: any) => setKeyword(e.target.value)}
          name="keyword"
        />
        <div className="d-flex justify-content-center">
          <CSVLink
            data={downloadData}
            target="_blank"
            filename={
              "Landlords/Agents" +
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
      {loadingCustomers || veryfyingCustomer ? (
        <Spin />
      ) : (
        <Table dataSource={dataSource} columns={columns} />
      )}
    </div>
  );
};

export default AllCustomers;

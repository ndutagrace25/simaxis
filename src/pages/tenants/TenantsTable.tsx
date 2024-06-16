import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";
import { getTenants, Tenant } from "../../features/tenant/tenantSlice";

const TenantsTable = () => {
  const { tenants, loadingTenants } = useSelector(
    (state: RootState) => state.tenant
  );
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = tenants.map((item: Tenant) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      name: `${item.first_name} ${item.last_name}`,
      landlord: `${item.Customer.first_name} ${item.Customer.last_name}`,
      building_name: item.Customer.building_name,
    };
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      title: "Agent/Landlord",
      dataIndex: "landlord",
      key: "landlord",
    },
    {
      title: "Building/Apartment",
      dataIndex: "building_name",
      key: "building_name",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  useEffect(() => {
    dispatch(getTenants());
  }, []);

  return (
    <div className="mt-3">
      {loadingTenants ? (
        <Spin />
      ) : (
        <>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </div>
  );
};

export default TenantsTable;

import { AllCustomers } from "./customers";
import { AllMeters } from "./meters";
import { AllTenants } from "./tenants";
import { AllCustomerMeters } from "./customerMeters";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { AllPayments } from "./payments";
import { AllTokens } from "./tokens";

const AdminTabs = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Agents/Landlords",
      children: (
        <>
          <AllCustomers />
        </>
      ),
    },
    {
      key: "2",
      label: "Meters",
      children: <AllMeters />,
    },
    {
      key: "3",
      label: "Tenants",
      children: <AllTenants />,
    },
    {
      key: "4",
      label: "Customer Meters",
      children: <AllCustomerMeters />,
    },
    {
      key: "5",
      label: "Payments",
      children: <AllPayments />,
    },
    {
      key: "6",
      label: "Tokens",
      children: <AllTokens />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default AdminTabs;

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { AllCustomers } from "./customers";
import { AllMeters } from "./meters";

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
      children: "Tenants",
    },
    {
      key: "4",
      label: "Customer Meters",
      children: "Customer meters",
    },
    {
      key: "5",
      label: "Payments",
      children: "Payments",
    },
    {
      key: "6",
      label: "Tokens",
      children: "Tokens",
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default AdminTabs;

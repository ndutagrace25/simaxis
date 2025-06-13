import { AllCustomers } from "./customers";
import { AllMeters } from "./meters";
import { AllCustomerMeters } from "./customerMeters";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { AllPayments } from "./payments";
import { AllTokens } from "./tokens";
import { RevenueReport } from "./revenue";
import { appSession } from "../utils/appStorage";

const AdminTabs = () => {
  const user = appSession.getUser();
  const onChange = (key: string) => {
    console.log(key);
  };

  const baseItems: TabsProps["items"] = [
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

  const items =
    user?.role !== "System User"
      ? [
          ...baseItems,
          {
            key: "7",
            label: "Revenue Reports",
            children: <RevenueReport />,
          },
        ]
      : baseItems;

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default AdminTabs;

import { Tabs, ConfigProvider } from "antd";
import meterbox from "../assets/meterbox.png";
// import { IconMessage } from "@tabler/icons-react";
import { TokenMeters } from "../pages";


const AccountTabs = () => {
  const tabs = [
    {
      icon: <img src={meterbox} width={20} className="me-2" />,
      label: "My Token Meters",
      element: <TokenMeters />,
    },
    // {
    //   icon: <IconMessage width={20} className="me-2" />,
    //   label: "Purchased Tokens",
    //   element: </>,
    // },
  ];
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#1d6a96",
        },
      }}
    >
      <Tabs
        defaultActiveKey="1"
        type="card"
        size="small"
        onChange={(activeKey: string) => console.log(activeKey, "activeKey")}
        items={tabs.map((_, i) => {
          const id = String(i + 1);
          return {
            label: (
              <div className="fw-bold">
                {_.icon}
                {_.label}
              </div>
            ),
            key: id,
            children: _.element,
          };
        })}
      />
    </ConfigProvider>
  );
};

export default AccountTabs;

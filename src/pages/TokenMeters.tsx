import { Select, Divider, Button } from "antd";
import { useState } from "react";

const TokenMeters = () => {
  const [token_meter, setTokenMeter] = useState<string | null>(null);
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setTokenMeter(value);
  };
  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <div className="mt-2 mb-3">
        <Select
          showSearch
          placeholder="Select token meter"
          optionFilterProp="children"
          onChange={onChange}
          value={token_meter}
          onSearch={onSearch}
          filterOption={filterOption}
          className="col-12"
          options={[
            {
              value: "37185698745",
              label: "37185698745",
            },
            {
              value: "37185698846",
              label: "37185698846",
            },
            {
              value: "37185698999",
              label: "37185698999",
            },
          ]}
        />
      </div>
      <div className="shadow-sm rounded p-3 bg-white">
        <div className="text-center meter-title">Meter Number: 37185698745</div>
        <Divider />
        <div className="d-flex justify-content-between px-3 mb-2">
          <div>Latest token:</div>
          <div className="meter-title">1475-0553-400-5370-9209</div>
        </div>
        <div className="d-flex justify-content-between px-3 mb-3">
          <div>Device status:</div>
          <div className="text-success meter-title">Active</div>
        </div>
        <div className="d-flex justify-content-center">
          <Button className="bg-blue px-5" type="primary" shape="round">
            Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenMeters;

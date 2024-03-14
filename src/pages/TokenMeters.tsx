import { Select } from "antd";
import { useState } from "react";
import { MeterCard } from "../common";

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
      <MeterCard
        device_status="Active"
        meter_number={37185698745}
        latest_token="1475-0553-400-5370-9209"
      />
      <MeterCard
        device_status="Inactive"
        meter_number={37185698846}
        latest_token="1675-0553-400-5370-9209"
      />
      <MeterCard
        device_status="Active"
        meter_number={37185698999}
        latest_token="1575-0553-400-5370-9209"
      />
    </div>
  );
};

export default TokenMeters;

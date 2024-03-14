import { Select } from "antd";
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
      <div className="my-2">
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
    </div>
  );
};

export default TokenMeters;

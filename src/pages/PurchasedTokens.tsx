import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PurchasedToken } from "../common";

dayjs.extend(customParseFormat);

export interface PurchasedTokenTypes {
  meter_number: string;
  tokens: string;
  date: string;
  units: string;
  amount: string;
}

const PurchasedTokens = () => {
  const dateFormat = "YYYY-MM-DD";

  const tokenPurchased = [
    {
      meter_number: "37185698745",
      tokens: "1475-0553-400-5370-9209",
      date: "2024-02-27",
      units: "70.16",
      amount: "2000",
    },
    {
      meter_number: "37185698846",
      tokens: "1675-0553-400-5370-9209",
      date: "2024-02-25",
      units: "5.26",
      amount: "150",
    },
    {
      meter_number: "37185698999",
      tokens: "1575-0553-400-5370-9209",
      date: "2024-02-23",
      units: "5.61",
      amount: "160",
    },
  ];

  return (
    <div className="px-3">
      <div className="mb-3">
        <DatePicker maxDate={dayjs(new Date(), dateFormat)} />
      </div>
      {tokenPurchased.map((item: PurchasedTokenTypes, key: number) => (
        <PurchasedToken item={item} key={key} />
      ))}
    </div>
  );
};

export default PurchasedTokens;

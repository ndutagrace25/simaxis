import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PurchasedToken } from "../common";

dayjs.extend(customParseFormat);

const PurchasedTokens = () => {
  const dateFormat = "YYYY-MM-DD";

  return (
    <div>
      <div className="mb-3">
        <DatePicker maxDate={dayjs(new Date(), dateFormat)} />
      </div>
      <PurchasedToken />
    </div>
  );
};

export default PurchasedTokens;

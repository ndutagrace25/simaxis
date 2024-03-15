import { PurchasedTokenTypes } from "../pages/PurchasedTokens";

interface Props {
  item: PurchasedTokenTypes;
  key: number;
}
const PurchasedToken = ({ item, key }: Props) => {
  return (
    <div className="shadow-sm rounded p-3 bg-white mb-2" key={key}>
      <div className="d-flex justify-content-between mb-2 ">
        <div>Meter:</div>
        <div className="meter-title">{item.meter_number}</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Token:</div>
        <div className="meter-title mb-2">{item.tokens}</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Date:</div>
        <div className="meter-title mb-2">{item.date}</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Units:</div>
        <div className="meter-title mb-2">{item.units}</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Amount:</div>
        <div className="meter-title mb-2">KES {item.amount}</div>
      </div>
    </div>
  );
};

export default PurchasedToken;

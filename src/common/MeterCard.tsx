import { Button, Divider } from "antd";

interface Props {
  meter_number: string;
  latest_token: string;
  device_status: string;
}

const MeterCard = ({ meter_number, latest_token, device_status }: Props) => {
  return (
    <div className="shadow-sm rounded p-3 bg-white mb-2">
      <div className="text-center meter-title">
        Meter Number: {meter_number}
      </div>
      <Divider />
      <div className="d-flex justify-content-between px-3 mb-2">
        <div>Latest token:</div>
        <div className="meter-title">{latest_token}</div>
      </div>
      <div className="d-flex justify-content-between px-3 mb-3">
        <div>Device status:</div>
        <div className="meter-title">
          <span
            className={
              device_status === "Active" ? "text-success" : "text-danger"
            }
          >
            {device_status}
          </span>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        {device_status === "Active" ? (
          <Button className="bg-blue px-5" type="primary" shape="round">
            Pay
          </Button>
        ) : (
          <Button className="px-5" type="default" shape="round">
            Request for activation
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeterCard;

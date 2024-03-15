import { Button, Divider } from "antd";
import { Pay } from ".";
import Swal from "sweetalert2";

interface Props {
  meter_number: string;
  latest_token: string;
  device_status: string;
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  showModal: () => void;
}

const MeterCard = ({
  meter_number,
  latest_token,
  device_status,
  isModalOpen,
  handleOk,
  handleCancel,
  showModal,
}: Props) => {
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
          <>
            <Button
              className="bg-blue px-5"
              type="primary"
              shape="round"
              onClick={() => showModal()}
            >
              Pay
            </Button>
            <Pay
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
            />
          </>
        ) : (
          <Button
            className="px-5"
            type="default"
            shape="round"
            onClick={() => {
              Swal.fire(
                "Success",
                "Your request has been received. We will send you an SMS or an email for the approval status.",
                "success"
              );
            }}
          >
            Request for activation
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeterCard;

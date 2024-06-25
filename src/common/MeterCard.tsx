import { Button, Divider } from "antd";
import { useState } from "react";
import { Pay } from ".";
import Swal from "sweetalert2";
import { appSession } from "../utils/appStorage";
import { AttachTenant } from "../pages/customers";

interface Props {
  meter_number: string | undefined;
  latest_token: string;
  device_status: string;
  tenant?: string;
  customer_meter_id: string | undefined;
  meter_id: string | undefined;
}

const MeterCard = ({
  meter_number,
  latest_token,
  device_status,
  tenant,
  customer_meter_id,
  meter_id
}: Props) => {
  const user = appSession.getUser();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
      {user?.role === "Landlord" && tenant && (
        <div className="d-flex justify-content-between px-3 mb-2">
          <div>Tenant:</div>
          <div className="meter-title">{tenant}</div>
        </div>
      )}
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
          <div
            className={
              user?.role === "Landlord" && !tenant
                ? "d-flex justify-content-between col-md-12 col-sm-12"
                : ""
            }
          >
            {user?.role === "Landlord" && !tenant && (
              <AttachTenant
                meter_number={meter_number}
                customer_meter_id={customer_meter_id}
              />
            )}
            <div>
              <Pay
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                showModal={showModal}
                meter_number={meter_number}
                meter_id={meter_id}
                phone={user?.phone}
              />
            </div>
          </div>
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

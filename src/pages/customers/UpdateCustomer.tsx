import { useEffect, useState } from "react";
import { Button, Modal, Spin } from "antd";
import { IconPencil } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  updateCustomer,
  verifyCustomer,
} from "../../features/customer/customerSlice";
import { AttachMeter } from ".";
import { getSyncedMeters } from "../../features/meter/meterSlice";

const UpdateCustomer = ({
  customer_name,
  is_synced_to_stron,
  id,
  is_verified,
}: {
  customer_name: string;
  is_synced_to_stron: any;
  is_verified: any;
  id: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { veryfyingCustomer } = useSelector(
    (state: RootState) => state.customer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSyncedMeters());
  }, []);

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
    <>
      <IconPencil
        type="primary"
        onClick={showModal}
        width={16}
        className="cursor text-primary"
      />
      <Modal
        title={`Update ${customer_name} details`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Close"
        width={800}
        okButtonProps={{
          style: { display: "none" },
          className: "hide-onPrint",
        }}
      >
        <div className="d-flex justify-content-between">
          {is_verified && is_synced_to_stron ? (
            <AttachMeter customer_name={customer_name} customer_id={id}/>
          ) : (
            <span className="my-3">
              User needs to be verified and forwarded to Stron
            </span>
          )}
          {!is_verified && (
            <Button
              size="small"
              type="default"
              className="bg-success text-white my-3"
              onClick={() =>
                dispatch(updateCustomer({ id, data: { is_verified: true } }))
              }
            >
              Verify customer
            </Button>
          )}
          {!is_synced_to_stron && (
            <>
              {veryfyingCustomer ? (
                <Spin />
              ) : (
                <Button
                  className="bg-success text-white my-3"
                  size="small"
                  onClick={() => {
                    dispatch(verifyCustomer({ id }));
                  }}
                >
                  Forward to Stron
                </Button>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UpdateCustomer;

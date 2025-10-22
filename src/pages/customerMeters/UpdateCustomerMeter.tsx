import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

import { syncCustomerMeter } from "../../features/meter/meterSlice";

const UpdateCustomerMeter = ({
  METER_ID,
  is_synced_to_stron,
  id,
  CUST_ID,
  Account_ID,
  onClose,
}: {
  METER_ID: string | undefined;
  is_synced_to_stron: any;
  id: string | undefined;
  CUST_ID: string | undefined;
  Account_ID: string | undefined;
  onClose?: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { syncingCustomerMeterToStron } = useSelector(
    (state: RootState) => state.meter
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleOk = () => {
    if (onClose) {
      onClose();
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Modal
        title={`Update customer meter ${METER_ID} details`}
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
          {!is_synced_to_stron && (
            <>
              {syncingCustomerMeterToStron ? (
                <Spin />
              ) : (
                <Button
                  className="bg-success text-white my-3"
                  size="small"
                  onClick={() => {
                    dispatch(
                      syncCustomerMeter({
                        id,
                        Account_ID: `AC-${Account_ID}`,
                        CUST_ID: `CTS-${CUST_ID}`,
                        METER_ID,
                      })
                    );
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

export default UpdateCustomerMeter;

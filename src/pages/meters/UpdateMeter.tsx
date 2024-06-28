import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import { IconPencil } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";

import {
  clearMeterCredit,
  clearMeterTamper,
  syncMeter,
} from "../../features/meter/meterSlice";

const UpdateMeter = ({
  meter_number,
  is_synced_to_stron,
  id,
}: {
  meter_number: string;
  is_synced_to_stron: any;
  id: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { syncingMeterToStron, clearingMeterCredit, clearingMeterTamper } =
    useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();

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
        title={`Update meter ${meter_number} details`}
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
              {syncingMeterToStron ||
              clearingMeterTamper ||
              clearingMeterCredit ? (
                <Spin />
              ) : (
                <>
                  <Button
                    className="bg-success text-white my-3"
                    size="small"
                    onClick={() => {
                      dispatch(syncMeter({ id }));
                    }}
                  >
                    Forward to Stron
                  </Button>
                </>
              )}
            </>
          )}
          {is_synced_to_stron && (
            <>
              <Button
                className="bg-success text-white my-3"
                size="small"
                onClick={() => {
                  dispatch(clearMeterTamper({ id }));
                }}
              >
                Clear meter tamper
              </Button>
              <Button
                className="bg-primary text-white my-3"
                size="small"
                onClick={() => {
                  dispatch(clearMeterCredit({ id }));
                }}
              >
                Clear meter credit (10KWh)
              </Button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UpdateMeter;

import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../store";

import { syncCustomerMeter } from "../../features/meter/meterSlice";

const UpdateCustomerMeter = ({
  METER_ID,
  is_synced_to_stron,
  id,
  CUST_ID,
  Account_ID,
  Categories,
  onClose,
}: {
  METER_ID: string | undefined;
  is_synced_to_stron: any;
  id: string | undefined;
  CUST_ID: string | undefined;
  Account_ID: string | undefined;
  Categories?: string;
  onClose?: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState({
    value: Categories || "Domestic",
    label: Categories || "Domestic",
  });
  const { syncingCustomerMeterToStron } = useSelector(
    (state: RootState) => state.meter
  );
  const dispatch = useDispatch<AppDispatch>();

  const categoryOptions = [
    { value: "Domestic", label: "Domestic - 31.74" },
    { value: "TIER ONE", label: "TIER ONE - 45.74" },
    { value: "TIER TWO", label: "TIER TWO - 35.74" },
  ];

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
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="form-label fw-semibold mb-2">Category</label>
            <Select
              value={selectedCategory}
              onChange={(selected) => {
                if (selected) {
                  setSelectedCategory(selected);
                }
              }}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
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
                      Categories: selectedCategory.value,
                    })
                  );
                }}
              >
                {is_synced_to_stron ? "Update Category" : "Forward to Stron"}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateCustomerMeter;

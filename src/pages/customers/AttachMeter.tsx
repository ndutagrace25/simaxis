import { useState, useEffect } from "react";
import { Button, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getSyncedMeters, Meter } from "../../features/meter/meterSlice";
import Select from "react-select";
import Swal from "sweetalert2";
import { attachMeterToCustomer } from "../../features/customer/customerSlice";

const AttachMeter = ({
  customer_name,
  customer_id,
}: {
  customer_name: string;
  customer_id: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meter_id, setMeterId] = useState<any>("");

  const { syncedMeters } = useSelector((state: RootState) => state.meter);
  const { attachingMeter } = useSelector((state: RootState) => state.customer);
  const dispatch = useDispatch<AppDispatch>();

  const formattedMeters = syncedMeters
    .filter((item: Meter) => !item.CustomerMeter)
    .map((meter: Meter) => {
      return { value: meter.id, label: meter.serial_number };
    });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsModalOpen(false);
    setMeterId("");
    dispatch(getSyncedMeters());
  }, [attachingMeter]);

  const attachMeter = () => {
    if (!meter_id?.value) {
      Swal.fire("Error", "Select a meter first", "success");
    } else {
      let data = {
        customer_id,
        meter_id: meter_id?.value,
      };

      dispatch(attachMeterToCustomer(data));
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button size="small" type="primary" className="my-3" onClick={showModal}>
        Attach meter to customer
      </Button>
      <Modal
        title={`Attach meter to ${customer_name}`}
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
        <div>
          <div>
            <div className="my-2 fw-bolder">Meter Type</div>
            <div>
              <Select
                value={meter_id}
                onChange={(selected: any) => setMeterId(selected)}
                placeholder="Enter the meter"
                options={formattedMeters}
              />
              <div className="mt-3 d-flex justify-content-center">
                {!meter_id?.value ? (
                  <Button disabled>Attach Meter to {customer_name}</Button>
                ) : (
                  <>
                    {attachingMeter ? (
                      <>
                        <Spin />
                      </>
                    ) : (
                      <Button onClick={() => attachMeter()} type="primary">
                        Attach Meter to {customer_name}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttachMeter;

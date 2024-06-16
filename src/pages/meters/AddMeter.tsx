import { useEffect, useState } from "react";
import { Button, Modal, Input, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { County, MeterType, saveMeter } from "../../features/meter/meterSlice";
import Select from "react-select";
import Swal from "sweetalert2";

const AddMeter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serial_number, setMeterNumber] = useState<string>("");
  const [meter_type_id, setMeterType] = useState<any>("");
  const [county_number, setCounty] = useState<any>("");

  const { meterTypes, savingMeter, counties } = useSelector(
    (state: RootState) => state.meter
  );
  const dispatch = useDispatch<AppDispatch>();

  const meterTypesFormatted = meterTypes.map((item: MeterType) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const countiesFormatted = counties.map((item: County) => {
    return {
      value: item.code,
      label: item.name,
    };
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
    setMeterNumber("");
    setMeterType("");
    setCounty("");
  }, [savingMeter]);

  const onSavingMeeter = () => {
    if (!serial_number || !meter_type_id?.value || !county_number?.value) {
      Swal.fire("Error", "All fields are required", "error");
    } else {
      let data = {
        serial_number: parseInt(serial_number),
        meter_type_id: meter_type_id?.value,
        county_number: county_number?.value,
      };

      dispatch(saveMeter(data));
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} size="small">
        Add a meter
      </Button>
      <Modal
        title="Add a meter"
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
        <div className="mb-4">
          <div>
            <div className="mb-2 fw-bolder">Meter Number</div>
            <div>
              <Input
                value={serial_number}
                type="number"
                onChange={(e: any) => setMeterNumber(e.target.value)}
                placeholder="Enter the meter number"
              />
            </div>
          </div>
          <div>
            <div className="my-2 fw-bolder">Meter Type</div>
            <div>
              <Select
                value={meter_type_id}
                onChange={(selected: any) => setMeterType(selected)}
                placeholder="Enter the meter type"
                options={meterTypesFormatted}
              />
            </div>
          </div>
          <div>
            <div className="my-2 fw-bolder">County</div>
            <div>
              <Select
                value={county_number}
                onChange={(selected: any) => setCounty(selected)}
                placeholder="Enter the county the meter should be attached"
                options={countiesFormatted}
              />
            </div>
          </div>
          <div className=" d-flex justify-content-center col-md-12">
            <div className="my-3">
              {savingMeter ? (
                <Spin />
              ) : (
                <Button type="primary" onClick={() => onSavingMeeter()}>
                  Save meter
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMeter;

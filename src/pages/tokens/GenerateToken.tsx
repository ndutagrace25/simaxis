/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Input, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { generateToken, Meter } from "../../features/meter/meterSlice";
import Select from "react-select";
import Swal from "sweetalert2";

const GenerateToken = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { meters, generatingToken } = useSelector(
    (state: RootState) => state.meter
  );
  const [meter_id, setMeter] = useState<any>(null);
  const [phone_number, setPhone] = useState<any>(null);
  const [amount, setAmount] = useState<any>(null);
  const [payment_code, setCode] = useState<any>(null);

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

  const displayMeters = meters.map((meter: Meter) => {
    return { value: meter?.id, label: meter?.serial_number };
  });

  const handleMeterChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setMeter(selectedOption);
  };

  const handleSubmit = () => {
    if (!meter_id?.value || !phone_number || !amount || !payment_code) {
      Swal.fire("Error", "All fields are required!", "error");
    } else {
      let data = {
        meter_id: meter_id?.value,
        phone_number,
        amount,
        payment_code,
      };

      Swal.fire({
        title: `Are you sure you want to generate token for ${phone_number}, meter ${meter_id?.label}, M-PESA code ${payment_code} and amount ${amount}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Generate",
        denyButtonText: `Don't generate`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          dispatch(generateToken(data));
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Generate Token Manually
      </Button>
      <Modal
        title={`Manually generate token for customer`}
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
        <div className="col-md-6">
          <div className="fw-bold mb-2">Select meter</div>
          <Select
            value={meter_id}
            onChange={(option) => handleMeterChange(option)}
            options={displayMeters}
            placeholder="Select a meter..."
          />
          <div className="fw-bold my-2">Phone number</div>
          <Input
            value={phone_number}
            onChange={(e: any) => setPhone(e?.target?.value)}
            placeholder="Phone numner"
            name="phone_number"
          />
          <div className="fw-bold my-2">M-PESA code</div>
          <Input
            value={payment_code}
            onChange={(e: any) => setCode(e?.target?.value)}
            placeholder="M-PESA code"
            name="payment_code"
          />
          <div className="fw-bold my-2">Amount</div>
          <Input
            value={amount}
            onChange={(e: any) => setAmount(e?.target?.value)}
            placeholder="Amount"
            name="amount"
          />
          <div className="my-3">
            {meter_id?.value && phone_number && amount && payment_code ? (
              <>
                {generatingToken ? (
                  <Spin />
                ) : (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleSubmit();
                      setMeter("");
                      setPhone("");
                      setAmount("");
                      setCode("");
                      setIsModalOpen(false);
                    }}
                  >
                    Generate Token
                  </Button>
                )}
              </>
            ) : (
              <Button disabled>Generate Token</Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GenerateToken;

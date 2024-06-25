import { Modal, Input, Button, Spin } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { AppDispatch, RootState } from "../store";
import { buyTokens } from "../features/meter/meterSlice";

interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  showModal: () => void;
  meter_id: string | undefined;
  meter_number: string | undefined;
  phone: string | undefined;
}

interface FormInputs {
  meter_number: string | undefined;
  phone_number: string | undefined;
  amount: string | undefined;
}

const Pay = ({
  isModalOpen,
  handleOk,
  handleCancel,
  showModal,
  meter_id,
  meter_number,
  phone,
}: Props) => {
  const [formInputs, setFormInputs] = useState<FormInputs>({
    meter_number: meter_number,
    phone_number: phone,
    amount: "",
  });

  useEffect(() => {
    console.log("Updating form inputs:", { meter_number, phone });
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      meter_number: meter_number,
      phone_number: phone,
    }));
  }, [meter_number, phone]);

  const dispatch = useDispatch<AppDispatch>();
  const { buyingTokens } = useSelector((state: RootState) => state.meter);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  return (
    <>
      <Button
        className="bg-blue px-5"
        type="primary"
        shape="round"
        onClick={() => {
          showModal();
        }}
      >
        Pay
      </Button>
      <Modal
        title={<div className="text-center">Top up your tokens</div>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { display: "none" },
          className: "hide-onPrint",
        }}
        cancelText="Close"
      >
        <div className="d-flex justify-content-center flex-column align-items-center col-12">
          <div className="col-8">
            <label className="mb-2">Meter number</label>
            <Input
              name="meter_number"
              value={formInputs.meter_number}
              readOnly
            />
          </div>
          <div className="my-3 col-8">
            <label className="mb-2">
              Phone number <small>(M-PESA number)</small>
            </label>
            <Input
              name="phone_number"
              value={formInputs.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-8">
            <label className="mb-2">Amount</label>
            <Input
              name="amount"
              value={formInputs.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              type="number"
            />
          </div>
          <div className="mt-4">
            {buyingTokens ? (
              <Spin />
            ) : (
              <Button
                className="bg-blue px-5"
                type="primary"
                shape="round"
                onClick={() => {
                  if (!formInputs.phone_number || !formInputs.amount) {
                    Swal.fire(
                      "Error",
                      "Phone number and amount are required",
                      "error"
                    );
                  } else {
                    dispatch(
                      buyTokens({
                        phone: formInputs.phone_number,
                        amount: formInputs.amount,
                        meter_number: formInputs.meter_number,
                        meter_id,
                      })
                    );
                  }
                }}
              >
                Pay
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Pay;

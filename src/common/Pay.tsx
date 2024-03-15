import { Modal, Input, Button } from "antd";
import { useState } from "react";

interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

interface FormInputs {
  meter_number: string;
  phone_number: string;
  amount: number | string;
}

const Pay = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  const [form_inputs, setFormInputs] = useState<FormInputs>({
    meter_number: "37185698745",
    phone_number: "+2547000000",
    amount: "",
  });
  return (
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
          <label className="mb-2 ">Metre number</label>
          <Input value={form_inputs.meter_number} />
        </div>
        <div className="my-3 col-8">
          <label className="mb-2">
            Phone number <small>(M-PESA number)</small>
          </label>
          <Input
            value={form_inputs.phone_number}
            onChange={(e: any) =>
              setFormInputs({ ...form_inputs, phone_number: e.target.value })
            }
          />
        </div>
        <div className="col-8">
          <label className="mb-2">Amount</label>
          <Input
            value={form_inputs.amount}
            onChange={(e: any) =>
              setFormInputs({ ...form_inputs, amount: e.target.value })
            }
            placeholder="Enter amount"
            type="number"
          />
        </div>
        <div className="mt-4">
          <Button className="bg-blue px-5" type="primary" shape="round">
            Pay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Pay;

import { Button, Input, Modal } from "antd";

const ResendTokenModal = ({
  token,
  meter_number,
  isResendTokenModalOpen,
  handleCancelResendToken,
  phone,
  setPhone,
  handleResendToken,
}: {
  token: string;
  meter_number: string;
  isResendTokenModalOpen: boolean;
  handleCancelResendToken: () => void;
  phone: string;
  setPhone: (phone: string) => void;
  handleResendToken: (token: string, meter_number: string) => void;
}) => {
  return (
    <Modal
      title="Resend Token"
      open={isResendTokenModalOpen}
      onCancel={handleCancelResendToken}
      okButtonProps={{
        style: { display: "none" },
        className: "hide-onPrint",
      }}
      cancelText="Close"
    >
      <div className="fw-bold">
        Resend token <span className="text-primary">{token}</span> to recharge
        meter <span className="text-primary">{meter_number}</span>
      </div>
      <div className="fw-light my-2">Phone number</div>
      <Input
        placeholder="Phone number"
        className=""
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button
        type="primary"
        className="bg-success mt-3"
        onClick={() => handleResendToken(token, meter_number)}
      >
        Resend
      </Button>
    </Modal>
  );
};

export default ResendTokenModal;

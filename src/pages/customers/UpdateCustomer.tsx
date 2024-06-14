import { useState } from "react";
import { Button, Modal, Spin } from "antd";
import { IconPencil } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { verifyCustomer } from "../../features/customer/customerSlice";

const UpdateCustomer = ({
  customer_name,
  is_synced_to_stron,
  id,
}: {
  customer_name: string;
  is_synced_to_stron: any;
  id: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { veryfyingCustomer } = useSelector(
    (state: RootState) => state.customer
  );
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
        title={`Update ${customer_name} details`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Close"
        okButtonProps={{
          style: { display: "none" },
          className: "hide-onPrint",
        }}
      >
        <div className="d-flex justify-content-between">
          <Button size="small" type="primary" className="my-3">
            Attach meter to customer
          </Button>
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
                  Verify customer
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

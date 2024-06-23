import { Modal, Button, Spin } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AppDispatch, RootState } from "../../store";
import { Landlord } from "../../features/customer/customerSlice";
import { updateCustomerMeter } from "../../features/meter/meterSlice";

const AttachTenant = ({
  meter_number,
  customer_meter_id,
}: {
  meter_number: string | undefined;
  customer_meter_id: string | undefined;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenant_id, setTenant] = useState<any>("");
  const dispatch = useDispatch<AppDispatch>();

  const { landlord_tenants } = useSelector(
    (state: RootState) => state.customer
  );
  const { updatingCustomerMeter } = useSelector(
    (state: RootState) => state.meter
  );

  const tenants = landlord_tenants.map((item: Landlord) => {
    return { value: item.id, label: `${item.first_name} ${item.last_name}` };
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

  return (
    <>
      <div>
        <Button
          type="default"
          shape="round"
          className="me-3"
          onClick={() => showModal()}
        >
          Attach tenant
        </Button>
      </div>
      <Modal
        title={
          <div className="text-center">
            Attach tenant to meter {meter_number}
          </div>
        }
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
          <div className="col-md-8">
            <Select
              value={tenant_id}
              onChange={(selected: any) => setTenant(selected)}
              placeholder="Select tenant"
              options={tenants}
            />
          </div>
          {!tenant_id?.value ? (
            <div className="mt-4">
              <Button shape="round" disabled>
                Attach Tenant
              </Button>
            </div>
          ) : (
            <>
              {updatingCustomerMeter ? (
                <Spin className="mt-4" />
              ) : (
                <div className="mt-4">
                  <Button
                    className="bg-blue px-5"
                    type="primary"
                    shape="round"
                    onClick={() =>
                      dispatch(
                        updateCustomerMeter({
                          id: customer_meter_id,
                          data: { tenant_id: tenant_id?.value },
                        })
                      )
                    }
                  >
                    Attach Tenant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AttachTenant;

import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { MeterCard } from "../common";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { CustomerMeter, getLandlordMeters } from "../features/meter/meterSlice";
import { appSession } from "../utils/appStorage";

const TokenMeters = () => {
  const [token_meter, setTokenMeter] = useState<string | undefined>("");

  const dispatch = useDispatch<AppDispatch>();

  const user = appSession.getUser();

  useEffect(() => {
    dispatch(
      getLandlordMeters({ id: user?.customer_id, serial_number: token_meter })
    );
  }, [token_meter]);

  const {
    landlordMeters,
    loadingLandlordMeters,
    loadingTenantMeter,
    tenantMeter,
    updatingCustomerMeter,
  } = useSelector((state: RootState) => state.meter);

  const metersToFilter = landlordMeters.map((item: any) => {
    return {
      value: item?.Meter?.serial_number,
      label: item?.Meter?.serial_number,
    };
  });

  const tokenMeters = landlordMeters.map((item: CustomerMeter) => {
    return {
      device_status:
        item?.Meter?.is_synced_to_stron && item?.is_synced_to_stron
          ? "Active"
          : "Deactivated",
      meter_number: item?.Meter?.serial_number,
      latest_token: item?.Meter?.MeterTokens[0]?.token,
      tenant: item?.Tenant
        ? `${item?.Tenant?.first_name} ${item?.Tenant?.last_name}`
        : "",
      customer_meter_id: item.id,
      meter_id: item.meter_id,
    };
  });

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setTokenMeter(value);
  };
  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className="px-3">
      {user?.role === "Landlord" && (
        <div className="mt-2 mb-3">
          <Select
            showSearch
            placeholder="Select token meter"
            optionFilterProp="children"
            onChange={onChange}
            value={token_meter}
            onSearch={onSearch}
            filterOption={filterOption}
            className="col-12"
            options={metersToFilter}
          />
        </div>
      )}

      {loadingLandlordMeters || updatingCustomerMeter || loadingTenantMeter ? (
        <Spin />
      ) : (
        <>
          <>
            {user?.role === "Landlord" &&
              (tokenMeters.length > 0
                ? tokenMeters.map((item: any, key: any) => (
                    <div key={key}>
                      <MeterCard
                        device_status={item.device_status}
                        meter_number={item.meter_number}
                        latest_token={item.latest_token}
                        tenant={item.tenant}
                        customer_meter_id={item.customer_meter_id}
                        meter_id={item.meter_id}
                      />
                    </div>
                  ))
                : "There are no meters attached to you")}
          </>
          <>
            {user?.role === "Tenant" &&
              (tenantMeter ? (
                <div>
                  <MeterCard
                    device_status={
                      tenantMeter?.Meter?.is_synced_to_stron &&
                      tenantMeter?.is_synced_to_stron
                        ? "Active"
                        : "Deactivated"
                    }
                    meter_number={tenantMeter?.Meter?.serial_number}
                    latest_token={tenantMeter?.Meter?.MeterTokens[0]?.token}
                    tenant={
                      tenantMeter?.Tenant
                        ? `${tenantMeter?.Tenant?.first_name} ${tenantMeter?.Tenant?.last_name}`
                        : ""
                    }
                    customer_meter_id={tenantMeter.id}
                    meter_id={tenantMeter.meter_id}
                  />
                </div>
              ) : (
                "There is no meter attached to you"
              ))}
          </>
        </>
      )}
    </div>
  );
};

export default TokenMeters;

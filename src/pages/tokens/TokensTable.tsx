import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Spin, Table, Tooltip } from "antd";
import { getTokens, Token } from "../../features/tokens/tokenSlice";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import { getMeters, Meter } from "../../features/meter/meterSlice";
import Select from "react-select";
import { GenerateToken } from ".";

const TokensTable = () => {
  const { tokens, loadingTokens } = useSelector(
    (state: RootState) => state.token
  );
  const {  generatingToken } = useSelector(
    (state: RootState) => state.meter
  );
  const [meter_id, setMeter] = useState<any>(null);

  const { meters } = useSelector((state: RootState) => state.meter);
  const dispatch = useDispatch<AppDispatch>();

  const dataSource = tokens.map((item: Token) => {
    return {
      ...item,
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      serial_number: item.Meter.serial_number,
      amount: `KES ${item.amount}`,
      total_units: `${item.total_units} KWh`,
    };
  });

  const downloadData = tokens.map((item: Token) => {
    return {
      created_at: moment(item.created_at).format("MM/DD/YYYY"),
      meter_number: item.Meter.serial_number,
      amount: item.amount,
      total_units: item.total_units,
      tokens: item.token,
    };
  });

  const displayMeters = meters.map((meter: Meter) => {
    return { value: meter?.id, label: meter?.serial_number };
  });

  const columns = [
    {
      title: "Meter Number",
      dataIndex: "serial_number",
      key: "serial_number",
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Units",
      dataIndex: "total_units",
      key: "total_units",
    },
    {
      title: "Type",
      dataIndex: "token_type",
      key: "token_type",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  useEffect(() => {
    dispatch(getTokens(meter_id?.value));
    dispatch(getMeters(""));
  }, [meter_id?.value]);

  const handleMeterChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setMeter(selectedOption);
  };

  const refresh = () => {
    dispatch(getTokens(""));
    setMeter("");
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <GenerateToken />
        <Select
          value={meter_id}
          onChange={(option) => handleMeterChange(option)}
          options={displayMeters}
          placeholder="Select a meter..."
          className="col-md-2"
        />

        <div className="d-flex justify-content-center">
          <CSVLink
            data={downloadData}
            target="_blank"
            filename={
              "Tokens" +
              "_" +
              moment(new Date()).format("DD/MM/YYYY HH:mm:ss") +
              ".csv"
            }
          >
            <Button type="dashed">
              <span className="me-2">Download</span>
              <span>
                <IconDownload width={16} />
              </span>
            </Button>
          </CSVLink>
        </div>
        <Tooltip title="refresh data">
          <IconRefresh
            className="text-primary cursor"
            onClick={() => refresh()}
          />
        </Tooltip>
      </div>
      {(loadingTokens || generatingToken)? (
        <Spin />
      ) : (
        <>
          <Table dataSource={dataSource} columns={columns} />
        </>
      )}
    </div>
  );
};

export default TokensTable;

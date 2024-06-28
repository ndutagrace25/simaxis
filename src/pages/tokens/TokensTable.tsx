import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import moment from "moment";
import { useEffect } from "react";
import { Spin, Table } from "antd";
import { getTokens, Token } from "../../features/tokens/tokenSlice";

const TokensTable = () => {
  const { tokens, loadingTokens } = useSelector(
    (state: RootState) => state.token
  );
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
    dispatch(getTokens());
  }, []);

  return (
    <div className="mt-3">
      {loadingTokens ? (
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

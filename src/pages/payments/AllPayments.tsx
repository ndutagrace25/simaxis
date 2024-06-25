import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { getCounties, getMeterTypes } from "../../features/meter/meterSlice";
import PaymentsTable from "./PaymentsTable";

const AllPayments = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getMeterTypes());
    dispatch(getCounties());
  }, []);

  return (
    <div className="mb-4">
      <PaymentsTable />
    </div>
  );
};

export default AllPayments;

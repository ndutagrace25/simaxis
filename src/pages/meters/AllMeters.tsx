import { useDispatch } from "react-redux";
import { AddMeter, MetersTable } from ".";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { getCounties, getMeterTypes } from "../../features/meter/meterSlice";

const AllMeters = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getMeterTypes());
    dispatch(getCounties());
  }, []);

  return (
    <div className="mb-4">
      <AddMeter />
      <MetersTable />
    </div>
  );
};

export default AllMeters;

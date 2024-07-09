import { useDispatch } from "react-redux";
import { MetersTable } from ".";
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
      <MetersTable />
    </div>
  );
};

export default AllMeters;

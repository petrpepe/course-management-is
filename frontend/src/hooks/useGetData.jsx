import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)

  useEffect(() => {
    if (data.status === Status.Idle) {
        dispatch(getData())
    }

    if (data.status === Status.Error && getTries < 3) {
      console.log(data.message);
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }
  }, [data.status, data.message, dispatch, getData, resetData]);

  return [data];
};

export default useGetData;
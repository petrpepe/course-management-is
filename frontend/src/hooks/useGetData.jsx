import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, getParam) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)
  const dataStatus = useRef(data.status)
  const getParamRef = useRef(getParam)

  useMemo(() => {
    dispatch(getData(getParamRef.current))

    if (dataStatus.current === Status.Error && getTries.current < 3) {
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }

    return () => {
      dispatch(resetData())
    }
  }, [dispatch, getData, resetData]);

  dataStatus.current = data.Status
  getParamRef.current = getParam

  return data
};

export default useGetData;
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, getParam) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)
  const getParamRef = useRef(getParam)
  const dataStatus = useRef(data.status)

  useEffect(() => {
    dispatch(getData(getParamRef.current))

    if (dataStatus === Status.Error && getTries.current < 3) {
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }

    return () => {
      dispatch(resetData())
    }
  }, [dataStatus, getParamRef, resetData, getData, dispatch]);

  return data
}

export default useGetData;
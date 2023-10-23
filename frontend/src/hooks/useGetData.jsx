import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, getParams) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)

  useEffect(() => {
    if (data.status === Status.Idle) {
      dispatch(getData(getParams))
    }
    
    if (data.status === Status.Error && getTries.current < 3) {
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }

    if (data.status === Status.Loading) {
      console.log("Loading " + dataKey);
    }

    return () => {
      if (data.status === Status.Success) {
        dispatch(resetData())
      }
    }
  }, [data.status, dataKey, getParams, dispatch, getData, resetData]);

  return data
};

export default useGetData;
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, ids, detail, courseId) => {
  const dispatch = useDispatch()
  const {[dataKey]: data, status, message} = useSelector((state) => state[dataKey])

  const dataStatus = useRef(status)
  const getTries = useRef(0)
// courseId univerzálně?
  useEffect(() => {
    dispatch(getData({ids: ids, detail: detail, courseId: courseId}))

    if (dataStatus === Status.Error && getTries.current < 3) {
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }

    return () => {
      dispatch(resetData())
    }
  }, [dataStatus, ids, detail, courseId, dispatch, getData, resetData]);
  const result = useMemo(() => {data[dataKey] && data}, [data])
  return useMemo({[dataKey]: data, status: status, message: message}, [data, status, message]);
};

export default useGetData;
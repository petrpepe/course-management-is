import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, ids, detail, courseId) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)
  const oldDetail = useRef({[dataKey]: ""})
// courseId univerzálně?
  useEffect(() => {
    if (data.status === Status.Idle) {
      dispatch(getData({ids: ids, detail: detail, courseId: courseId}))
    }

    if (data.status === Status.Success && oldDetail.current[dataKey] !== detail) {
      dispatch(resetData())
      dispatch(getData({ids: ids, detail: detail, courseId: courseId}))
      oldDetail.current[dataKey] = detail
    } 

    if (data.status === Status.Error && getTries.current < 3) {
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }
  }, [data.status, data.message, dataKey, ids, detail, courseId, dispatch, getData, resetData]);

  return data;
};

export default useGetData;
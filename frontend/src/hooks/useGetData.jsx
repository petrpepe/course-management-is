import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, ids, detail, courseId) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)
  const oldDetail = useRef({[dataKey]: {detail: '', length: data.length}})
// courseId univerzálně?
  useEffect(() => {
    if (data.status === Status.Idle) {
      dispatch(getData({ids: ids, detail: detail, courseId: courseId}))
    }

    if (data.status === Status.Success && (oldDetail.current[dataKey].detail !== detail || oldDetail.current[dataKey].length !== data.length)) {
      dispatch(getData({ids: ids, detail: detail, courseId: courseId}))
      oldDetail.current[dataKey].detail = detail
      oldDetail.current[dataKey].length = data.length
      console.log("ahoj");
    }

    if (data.status === Status.Error && getTries.current < 3) {
      setTimeout(() => {
        getTries.current = getTries.current + 1;
        dispatch(resetData())
      }, "3000");
    }

    return () => {resetData()}
  }, [data.status, data.length, dataKey, ids, detail, courseId, dispatch, getData, resetData]);

  return data;
};

export default useGetData;
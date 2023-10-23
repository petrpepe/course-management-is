import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Status } from "../features/Status";

const useGetData = (dataKey, getData, resetData, ids, detail, courseId) => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[dataKey])
  const getTries = useRef(0)
  const dataStatus = useRef(data.status)
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
  dataStatus.current = data.status

  return data;
};

export default useGetData;
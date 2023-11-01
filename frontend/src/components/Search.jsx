import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";

function Search({ getData, resetData }) {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(resetData());
    dispatch(getData({ keyword: keyword }));
  }, [keyword, dispatch, getData, resetData]);

  return (
    <TextField
      id="searchBar"
      type="search"
      value={keyword}
      label="Search:"
      placeholder="Search"
      size="medium"
      fullWidth
      sx={{ my: 1 }}
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
}

export default Search;

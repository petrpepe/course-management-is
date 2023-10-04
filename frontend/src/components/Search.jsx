import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Input from "./form/Input"

function Search({getData = () => {}}) {
    const dispatch = useDispatch()

    const [keyword, setKeyword] = useState("")

    useEffect(() => {
        dispatch(getData({keyword: keyword}))
    }, [keyword, dispatch, getData])

    return (
        <div className="search-wrapper">
            <Input id="searchBar" type="search" value={keyword} label="Search:" placeholder="Search" onChange={(e) => setKeyword(e.target.value)} />
        </div>
    )
}

export default Search
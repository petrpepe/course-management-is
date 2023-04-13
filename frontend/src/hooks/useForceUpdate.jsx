import { useState } from "react"

export default function useForceUpdate(){
    const [value, setValue] = useState(0)
    let a = value
    return () => setValue(value => value + 1 + a - a)
}
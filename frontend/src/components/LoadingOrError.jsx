import { CircularProgress } from "@mui/material";
import { Status } from "../features/Status";

function LoadingOrError ({status}) {
    if (status === Status.Loading ) {
        return <CircularProgress sx={{position: "absolute", top: "50%", left: "50%"}} />
    }

    if (status === Status.Error ) {
        return <p>Error</p>
    }
}

export default LoadingOrError;
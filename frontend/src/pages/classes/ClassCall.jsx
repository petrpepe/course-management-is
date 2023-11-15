import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { Status } from "../../features/Status";
import useGetData from "../../hooks/useGetData";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getTimetables,
  reset as resetTimetables,
} from "../../features/timetables/timetableSlice";
import Box from "@mui/material/Box";
import ClassCallDetails from "../../components/ClassCallDetails";
import Paper from "@mui/material/Paper";
import ClassLessonTitle from "../../components/ClassLessonTitle";

function ClassCall() {
  const timetableId = useParams().id;
  const { timetables, status: timetableStatus } = useGetData(
    "timetables",
    getTimetables,
    resetTimetables,
    {
      ids: timetableId,
    }
  );
  const user = useSelector((state) => state.auth.user);

  if (timetableStatus === Status.Loading) {
    return <CircularProgress />;
  }

  if (timetableStatus === Status.Success) {
    const timetable = timetables.filter((t) => t._id === timetableId)[0];
    return (
      <Paper elevation={0} sx={{ height: "100%" }}>
        <ClassLessonTitle
          classId={timetable.classId}
          lessonId={timetable.lesson}
        />
        {(user.roles.includes("lector") || user.roles.includes("admin")) && (
          <ClassCallDetails timetable={timetable} />
        )}
        <Box
          sx={{
            my: 2,
            width: "100%",
            display: "inline-block",
            height: "500px",
          }}>
          <JaaSMeeting
            appId="vpaas-magic-cookie-833fb394f589407bb89b0c4484d9d7fa"
            roomName={timetable.classId}
            configOverwrite={{
              startWithAudioMuted: true,
              disableModeratorIndicator: true,
              startScreenSharing: true,
              enableEmailInStats: false,
              prejoinConfig: {
                enabled: true,
              },
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              VIDEO_LAYOUT_FIT: "nocrop",
              MOBILE_APP_PROMO: false,
              TILE_VIEW_MAX_COLUMNS: 4,
            }}
            userInfo={{
              displayName: user.lastName + " " + user.firstName,
              email: user.email,
            }}
            /*onApiReady={(externalApi) => {
              // here you can attach custom event listeners to the Jitsi Meet External API
              // you can also store it locally to execute commands
            }}*/
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
            }}
          />
        </Box>
      </Paper>
    );
  }
}

export default ClassCall;

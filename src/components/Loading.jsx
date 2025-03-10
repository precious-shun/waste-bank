import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress sx={{ color: "#2C514B" }} />
    </div>
  );
};

export default Loading;

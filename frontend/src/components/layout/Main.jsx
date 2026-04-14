import { DRAWER_WIDTH } from '../../constants/constants';
import Box from '@mui/material/Box';

const Main = ({ open, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        ml: open ? 0 : `-${DRAWER_WIDTH}px`,
        transition: 'margin 0.3s',
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
};

export default Main;

import { DRAWER_WIDTH } from '../../constants/constants';
import Box from '@mui/material/Box';

const Main = ({ open, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        ml: open ? `${DRAWER_WIDTH}px` : 0,
        transition: 'margin 0.3s',
      }}
    >
      {children}
    </Box>
  );
};

export default Main;

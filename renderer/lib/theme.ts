import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00796B',
    },
    secondary: {
      main: '#FF9800',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F5F5F5',
    },
  },
});

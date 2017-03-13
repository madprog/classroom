import * as colorManipulator from 'material-ui/utils/colorManipulator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import * as colors from 'material-ui/styles/colors';

const theme = {
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    primary1Color: colors.lightGreen500,
    primary2Color: colors.lightGreen700,
    primary3Color: colors.blueGrey400,
    accent1Color: colors.deepOrangeA200,
    accent2Color: colors.blueGrey100,
    accent3Color: colors.blueGrey500,
    textColor: colors.darkBlack,
    secondaryTextColor: colorManipulator.fade(colors.darkBlack, 0.54),
    alternateTextColor: colors.white,
    canvasColor: colors.white,
    borderColor: colors.grey300,
    disabledColor: colorManipulator.fade(colors.darkBlack, 0.3),
    pickerHeaderColor: colors.lightGreen500,
    clockCircleColor: colorManipulator.fade(colors.darkBlack, 0.07),
    shadowColor: colors.fullBlack,
  },
};
export default getMuiTheme(theme);

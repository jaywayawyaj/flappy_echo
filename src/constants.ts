import {Dimensions} from 'react-native';

export const Constants: {[key: string]: number} = {
  MAX_WIDTH: Dimensions.get('screen').width,
  MAX_HEIGHT: Dimensions.get('screen').height,
  GAP_SIZE: 250,
  PIPE_WIDTH: 100,
  PILL_WIDTH: 50,
  PILL_HEIGHT: 57,
};

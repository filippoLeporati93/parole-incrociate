import {Dimensions} from 'react-native';

export const Size = Dimensions.get('window');

export const BoardWidth = Size.width;
export const BorderWidth = 2;

export const CellSize = Math.floor(BoardWidth / 6);
export const CellStackSize = Math.floor(BoardWidth / 12);

export const Color = {};

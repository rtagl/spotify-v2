import { atom, waitForAllSettled } from 'recoil';

export const currentTrackIdState = atom({
  // unique ID
  key: 'currentTrackIdState',
  default: null,
});

export const isPlayingState = atom({
  key: 'isPlayingState',
  default: false,
});

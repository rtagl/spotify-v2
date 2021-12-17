import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  currentTrackIdState,
  isPlayingState,
} from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import useSongInfo from '../hooks/useSongInfo';
import { useEffect } from 'react/cjs/react.development';
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] =
    useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('Now playing, ', data.body?.item.id);
        setCurrentIdTrack(data.body?.item?.id);
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            setIsPlaying(data.body?.is_playing);
          });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white 
      grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button hidden md:block" />
        <RewindIcon
          className="button"
          // onClick={() => spotifyApi.skipToPrevious()} - API not working
        />
        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="button w-10 h-10"
          />
        ) : (
          <PlayIcon
            onClick={handlePlayPause}
            className="button w-10 h-10"
          />
        )}

        <FastForwardIcon
          className="button"
          // onClick={() => spotifyApi.skipToNext()} - API not working
        />
        <ReplyIcon className="button hidden md:block" />
      </div>

      {/* Right Volume Section*/}
      <div
        className="flex items-center space-x-1 ml-2 
        md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() =>
            volume > 0 && setVolume(volume - 10)
          }
          className="button hidden md:block"
        />
        <input
          className="w-20 md:w-28"
          type="range"
          value={volume}
          onChange={(e) =>
            setVolume(Number(e.target.value))
          }
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() =>
            volume < 100 && setVolume(volume + 10)
          }
          className="button hidden md:block"
        />
      </div>
    </div>
  );
}

export default Player;

import * as Avatar from '@radix-ui/react-avatar'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as Slider from '@radix-ui/react-slider'
import { Transition } from '@headlessui/react'
import { Icon } from '@iconify-icon/react'
import { useAudio } from 'react-use'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useStore } from '~/store'
import { formatTime, parseLyric } from '~/utils'
import SongDetails from './SongDetails'
import { checkMusic, getMusic } from '~/api/song'
import { random } from 'lodash'
import { getLyric } from '~/api/lyric'
import toast from 'react-hot-toast'

enum PlayMode {
  Order,
  Shuffle,
  Loop,
  Single_Loop
}

const PlayIconMap = [
  'ri:order-play-line',
  'ion:shuffle',
  'material-symbols:repeat-rounded',
  'material-symbols:repeat-one-rounded'
]

const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useStore(state => [state.currentSong, state.setCurrentSong])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoop, setIsLoop] = useState(false)

  const currentPlaylistSong = useStore(state => state.currentPlaylistSong)
  const [playMode, setPlayMode] = useState<PlayMode>(0)
  const getCurrentIndex = () => {
    return currentPlaylistSong.findIndex(song => song.id === currentSong.id)
  }

  const getSongUrl = async (id: number, errorCallback: (message: string) => void) => {
    const { data: { success, message } } = await checkMusic(id)

    if (!success) {
      errorCallback(message)
      return
    }

    const { data: [song] } = await getMusic([id])
    const { data: { lrc, tlyric } } = await getLyric(id)

    return {
      url: song.url,
      lyrics: lrc.lyric,
      lyricsTranslation: tlyric.lyric
    }
  }

  const setPlaySong = (playSong: any) => {
    getSongUrl(playSong.id, (message) => {
      toast.error(message)
    })
      .then(song => {
        if (song) {
          const { url, lyrics, lyricsTranslation } = song

          setCurrentSong({
            id: playSong.id,
            name: playSong.name,
            image: playSong.al.picUrl,
            singers: playSong.ar,
            album: playSong.al,
            url,
            lyrics,
            lyricsTranslation
          })
        }
      })
  }

  const playPrev = async () => {
    const currentIndex = getCurrentIndex()
    if (currentIndex === -1) return

    const prevIndex = getNextIndex('prev', currentIndex, currentPlaylistSong.length, playMode)

    const prevSong = currentPlaylistSong[prevIndex]

    setPlaySong(prevSong)
  }

  const playNext = async () => {
    const currentIndex = getCurrentIndex()
    if (currentIndex === -1) return

    const nextIndex = getNextIndex('next', currentIndex, currentPlaylistSong.length, playMode)

    const nextSong = currentPlaylistSong[nextIndex]

    setPlaySong(nextSong)
  }

  const [audio, state, controls] = useAudio({
    src: currentSong?.url,
    autoPlay: true,
    loop: isLoop,
    onEnded: playNext
  })

  const formattedTime = formatTime(state.time)

  const lyric = useMemo(() =>
    parseLyric(currentSong.lyrics, ''),
    [currentSong.lyrics]
  )

  const close = () => {
    setIsOpen(false)
  }

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  const play = useCallback(() => controls.play(), [controls])
  const pause = useCallback(() => controls.pause(), [controls])
  const changePlayMode = () => {
    setPlayMode(state => (state + 1) % PlayIconMap.length)
  }
  const onVolumeChange = ([volume]: number[]) => {
    controls.volume(volume)
  }
  const onTimeChange = ([time]: number[]) => {
    controls.seek(time)
  }

  useEffect(() => {
    if (playMode === PlayMode.Single_Loop) {
      setIsLoop(true)
    } else {
      setIsLoop(false)
    }
  }, [playMode])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const { key } = event
      switch (key) {
        case ' ': {
          state.playing ? pause() : play()
          break
        }
        default:
          break
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [state.playing, play, pause])

  return (
    <Fragment>
      {audio}
      {/* 弹出歌曲信息 */}
      <Transition.Root className="fixed z-50 bottom-20 inset-x-0" show={isOpen}>
        <Transition.Child
          enter="ease-out duration-500"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="ease-in duration-300"
          leaveTo="translate-y-full"
          as={Fragment}
        >
          <div className="relative h-[calc(100vh-80px)] flex flex-col bg-gray-100 w-full">
            <ul className="p-4">
              <li>
                <Icon onClick={close} className="text-2xl text-gray-500 -rotate-90 cursor-pointer" icon="material-symbols:arrow-back-ios-new-rounded" />
              </li>
            </ul>
            <SongDetails
              onTimeChange={onTimeChange}
              time={state.time}
              lyric={lyric}
              isPlaying={state.playing}
              {...currentSong}
            />
          </div>
        </Transition.Child>
      </Transition.Root>
      <div
        className="
        fixed z-50 inset-x-0 h-20 
        bg-white bottom-0 left-0
        border-t
        flex justify-between items-center px-2
      "
      >
        {/* 进度条 */}
        <Slider.Root
          onValueChange={onTimeChange}
          value={[state.time]}
          max={state.duration}
          min={0}
          className="
            group
            flex items-center
            hover:h-1 hover:-top-1
            w-full h-[2px]
            absolute left-0 -top-[2px]
          "
        >
          <Slider.Track
            className="
              relative block w-full h-full
            "
          >
            <Slider.Range className="absolute h-full bg-sky-300" />
          </Slider.Track>
          <Slider.Thumb
            className="
              opacity-0 group-hover:opacity-100 
              transition-opacity 
              block w-3 h-3 rounded-full bg-sky-500
              focus:outline-none
            "
          />
        </Slider.Root>
        {/* 歌曲介绍 */}
        <div className="flex gap-x-2">
          <Avatar.Root
            className="
            group
            relative
            w-16 h-16 rounded-lg overflow-hidden
            block border cursor-pointer
          "
          >
            <Avatar.Image className="w-full h-full object-cover" src={currentSong.image} alt={currentSong.name} />
            <div
              onClick={toggle}
              className="
                absolute opacity-0 group-hover:opacity-100 
                transition-opacity
                inset-0 flex items-center justify-center 
                bg-black bg-opacity-75
              "
            >
              <Icon className={clsx('text-2xl text-white transition-transform', isOpen ? '-rotate-90' : 'rotate-90')} icon="material-symbols:arrow-back-ios-new-rounded" />
            </div>
          </Avatar.Root>
          <div className="flex flex-col justify-evenly">
            <p className="text-xl w-48 truncate">{currentSong.name}</p>
            <p className="w-48 truncate">
              {
                currentSong.singers.map((singer, i) => (
                  <Link
                    to={`/user/${singer.id}`}
                    key={singer.id}
                  >
                    {singer.name}{i === currentSong.singers.length - 1 ? '' : ','}
                  </Link>
                ))
              }
            </p>
          </div>
        </div>
        {/* 播放控制器 */}
        <div className="flex items-end gap-x-10">
          <span>{formattedTime}</span>
          <div className="text-4xl flex items-center gap-x-4">
            <Icon onClick={playPrev} icon="material-symbols:skip-previous-rounded" />
            {
              state.paused
                ? (<Icon className="text-5xl" onClick={play} icon="material-symbols:play-arrow-rounded" />)
                : (<Icon className="text-5xl" onClick={pause} icon="material-symbols:pause-rounded" />)
            }
            <Icon onClick={playNext} icon="material-symbols:skip-next-rounded" />
          </div>
          <span>{formatTime(state.duration)}</span>
        </div>
        {/* 功能区 */}
        <div className="flex w-72 text-2xl items-center gap-x-4">
          <Icon icon="solar:playlist-bold" />
          <Icon onClick={changePlayMode} icon={PlayIconMap[playMode]} />
          <Tooltip.Root delayDuration={300}>
            <Tooltip.Trigger asChild>
              {
                state.muted
                  ? (<Icon onClick={() => controls.unmute()} icon="material-symbols:volume-off-rounded" />)
                  : (<Icon onClick={() => controls.mute()} icon="material-symbols:volume-up-rounded" />)
              }
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={5}
                className="
                  relative z-50 w-10 h-24 rounded
                  bg-white drop-shadow p-2
                "
              >
                <Slider.Root
                  className="
                    relative w-full h-full 
                    flex justify-center items-center
                    select-none
                    group
                  "
                  value={[state.volume]}
                  defaultValue={[0.5]}
                  max={1}
                  min={0}
                  step={0.01}
                  orientation="vertical"
                  onValueChange={onVolumeChange}
                >
                  <Slider.Track
                    className="
                      relative h-full w-1 bg-gray-200
                      rounded-full
                    "
                  >
                    <Slider.Range className="absolute w-full rounded-full bg-sky-300" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="
                      opacity-0 group-hover:opacity-100 transition-opacity 
                      block w-3 h-3 rounded-full bg-sky-500 shadow
                      focus:outline-none
                    "
                    aria-label="volume"
                  />
                </Slider.Root>
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>
    </Fragment>
  )
}

export default MusicPlayer

function getNextIndex(
  type: 'prev' | 'next',
  currentIndex: number,
  playlistLength: number,
  playMode: PlayMode,
): number {
  let index = currentIndex

  switch (playMode) {
    case PlayMode.Single_Loop:
    case PlayMode.Order: {
      index = (type === 'prev' ? index - 1 : index + 1) % playlistLength
      break
    }
    case PlayMode.Shuffle: {
      index = random(0, playlistLength - 1)
      break
    }
    default: {
      break
    }
  }

  return index
}
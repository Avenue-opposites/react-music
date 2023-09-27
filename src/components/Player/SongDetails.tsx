import { Link } from 'react-router-dom'
import { Fragment, useEffect, useRef, useState } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Disk from './Disk'
import clsx from 'clsx'
import { Icon } from '@iconify-icon/react/dist/iconify.js'
import { formatTime, Lyric } from '~/utils'

interface SongDetailsProps {
  id: number;
  name: string;
  image: string;
  singers: any[];
  album: any;
  time: number;
  isPlaying: boolean;
  lyrics: Lyric[];
  lyricsTranslation: Lyric[];
  onTimeChange: (time: [number]) => void
}

const SongDetails: React.FC<SongDetailsProps> = ({
  id,
  time,
  name,
  image,
  singers,
  album,
  isPlaying,
  lyrics,
  lyricsTranslation,
  onTimeChange
}) => {
  if(!id) return

  const [isTranslate, setIsTranslate] = useState(false)
  const scrollViewportRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const activeLyricIndex = lyrics.findIndex(({ time: t }) => time <= t) - 1
  let isScrolling = false

  const scrollHandler = () => {
    isScrolling = true
    setTimeout(() => {
      isScrolling = false
    }, 500)
  }

  const getLyricView = (lyrics: Lyric[]) => {
    console.log(lyrics, time)
    

    if (!lyrics.length) {
      return <li>暂无歌词</li>
    }

    return (
      lyrics.map((line, i) => (
        <li className="py-2" key={i}>
          <div
            className={clsx(
              'transition flex gap-x-4 items-center ',
              activeLyricIndex === i ? 'text-sky-500 origin-[left_center] scale-150' : 'group'
            )}
          >
            <p>{line.lyric}</p>
            <span
              onClick={() => onTimeChange([line.time])}
              className="
              text-sm opacity-0 group-hover:opacity-100 
              transition-opacity flex items-center
              cursor-pointer
            "
            >
              {formatTime(line.time)}
              <Icon icon="material-symbols:play-arrow-rounded" />
            </span>
          </div>
        </li>
      ))
    )
  }

  useEffect(() => {
    const scrollViewport = scrollViewportRef.current
    const list = listRef.current

    if (!scrollViewport || !list || isScrolling) return

    const itemHeight = list.children[0].clientHeight

    const scrollViewportHeight = scrollViewport.clientHeight
    const offsetY = (activeLyricIndex * itemHeight) + (itemHeight / 2) - (scrollViewportHeight / 2)


    scrollViewport.scrollTo({
      top: offsetY,
      left: 0,
      behavior: 'smooth'
    })

  }, [activeLyricIndex, isScrolling])

  return (
    <ScrollArea.Root type="scroll" className="w-full h-[calc(100%-62px)]">
      <ScrollArea.Viewport className="w-full h-full">
        <div className="px-4">
          <div className="flex h-[calc(100vh-142px)]">
            <div className="w-[500px] h-full flex flex-col items-center">
              <Disk isPlaying={isPlaying} name={name} image={image} />
            </div>
            <div className="flex-1 h-full px-4">
              <div className="flex flex-col gap-y-4">
                <h1 className="text-3xl">{name}</h1>
                <p className="flex gap-x-2">
                  <span className="flex">
                    专辑：
                    <Link className="w-28 truncate text-sky-500 hover:text-sky-700 transition-colors" to={`/album/${album.id}`}>{album.name}</Link>
                  </span>
                  <span className="flex">
                    歌手：
                    <span className="w-36 truncate">
                      {singers.map((singer, i) => (
                        <Fragment key={singer.id}>
                          <Link className="text-sky-500 hover:text-sky-700 transition-colors" to={`/user/${singer.id}`}>{singer.name}</Link>
                          {i !== singers.length - 1 && (<span className="text-gray-500">&nbsp;/&nbsp;</span>)}
                        </Fragment>
                      ))}
                    </span>
                  </span>
                </p>
              </div>
              {/* 歌词 */}
              <ScrollArea.Root className="relative mt-4">
                <ScrollArea.Viewport ref={scrollViewportRef} onScroll={scrollHandler} className="w-full h-80 xl:h-[500px]">
                  <ul ref={listRef} className="py-4 text-lg text-gray-500">
                    {getLyricView(isTranslate ? lyricsTranslation : lyrics)}
                  </ul>
                  <button
                    className="
                  absolute bottom-0 right-0
                  bg-sky-500 rounded-full
                  w-8 h-8 text-white
                  hover:bg-sky-600 transition-colors
                "
                    onClick={() => setIsTranslate(!isTranslate)}
                  >
                    {isTranslate ? '原' : '译'}
                  </button>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="w-1.5 h-full" orientation="vertical">
                  <ScrollArea.Thumb className="w-full rounded-full bg-gray-300 cursor-pointer" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="w-1.5 h-full" orientation="vertical">
        <ScrollArea.Thumb className="w-full rounded-full bg-gray-300 cursor-pointer" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export default SongDetails
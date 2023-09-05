import { Link } from 'react-router-dom'
import { Fragment, useEffect, useRef } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Disk from './Disk'
import clsx from 'clsx'
import { Icon } from '@iconify-icon/react/dist/iconify.js'
import { formatTime } from '~/utils'

interface SongDetailsProps {
  id: number;
  name: string;
  image: string;
  singers: any[];
  album: any;
  time: number;
  isPlaying: boolean;
  lyric: ({ time: number, lyric: string, translation: string })[];
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
  lyric,
  onTimeChange
}) => {
  const listRef = useRef<HTMLUListElement | null>(null)
  const activeLyricIndex = lyric.findIndex(({ time:t }) => time <= t) - 1 
  let isScrolling = false
  
  const scrollHandler = () => {
    isScrolling = true
    setTimeout(() => {
      isScrolling = false
    }, 500)
  }

  useEffect(() => {
    const { current } = listRef
    if(!current || isScrolling) return

    const el = current.children[activeLyricIndex]
        
    if(!el) return

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [activeLyricIndex, isScrolling])

  return (
    <div className="w-full h-full flex px-4">
      <div className="w-2/5 h-full flex flex-col items-center">
        <Disk isPlaying={isPlaying} name={name} image={image} />
      </div>
      <div className="w-3/5 h-full px-4">
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
        <ScrollArea.Root className="mt-4">
          <ScrollArea.Viewport onScroll={scrollHandler} className="w- h-[550px]">
            <ul ref={listRef} className="py-4 text-lg text-gray-500 space-y-4">
              {
                lyric.length === 0 && (
                  <li>暂无歌词</li>
                )
              }
              {
                lyric.map((line, i) => (
                  <li 
                    className={clsx(
                      'transition flex gap-x-4 items-center',
                      activeLyricIndex === i ? 'text-sky-500 origin-[left_center] scale-150' : 'group'
                    )} 
                    key={line.time}
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
                  </li>
                ))
              }
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="w-1.5 h-full" orientation="vertical">
            <ScrollArea.Thumb className="w-full rounded-full bg-gray-300 cursor-pointer" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  )
}

export default SongDetails
import { Icon } from '@iconify-icon/react/dist/iconify.js'
import * as Avatar from '@radix-ui/react-avatar'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { throttle } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useParams } from 'react-router'
import { useStore } from '~/store'
import { formatFrequency } from '~/utils'
import Song from './components/Song'
import { getPlaylistAllSong } from '~/api/playlist'

const PlaylistPage = () => {
  const [lovedSongs, lovedPlaylist] = useStore(state => [state.lovedSongs, state.lovedPlaylist()])
  const scrollViewRef = useRef<HTMLDivElement | null>(null)
  const { id } = useParams()
  
  const limit = 50
  const [stateConfig, setStateConfig] = useState<{
    offset: number
    songs: any[]
  }>({
    offset: 0,
    songs: []
  })
  const loadSongs = useMemo(() => stateConfig.songs.slice(0, stateConfig.offset + limit), [stateConfig])
  const playlist = useStore(state => state.getPlaylistById(+id!))
  const avatar = useMemo(() => playlist?.creator.avatarUrl, [playlist])
  const cover = useMemo(() => playlist?.coverImgUrl, [playlist])
  const to = useMemo(() => `/user/${playlist?.creator.id}`, [playlist])
  const createAtText = useMemo(() => format(new Date(playlist?.createTime || 0), 'yyyy-MM-dd'), [playlist])
  const trackCount = useMemo(() => playlist?.trackCount || 0, [playlist])
  const playCount = useMemo(() => formatFrequency(playlist?.playCount), [playlist])

  useEffect(() => {
    if (!id) return
    if(id === lovedPlaylist?.id) {
      setStateConfig(state => ({
        ...state,
        songs: lovedSongs
      }))
      return
    }

    getPlaylistAllSong(+id, trackCount)
      .then((songs) => {
        
        setStateConfig(state => ({
          ...state,
          songs
        }))
      })
      .catch((reason) => {
        console.error(reason)
      })
  }, [id, trackCount, lovedSongs, lovedPlaylist?.id])

  useEffect(() => {
    if (!scrollViewRef.current) return

    const distance = 300
    const el = scrollViewRef.current

    const handler = throttle((event: Event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement

      if (scrollTop + clientHeight >= scrollHeight - distance) {
        setStateConfig(state => ({
          ...state,
          offset: state.offset + limit
        }))
      }
    }, 1000)

    el.addEventListener('scroll', handler)

    return () => {
      el.removeEventListener('scroll', handler)
    }
  }, [scrollViewRef])

  // console.log(loadSongs)


  return (
    <ScrollArea.Root className="h-full">
      <ScrollArea.Viewport ref={scrollViewRef} className="h-full w-full">
        <div>
          <div style={{ backgroundImage: `url(${cover})` }} className="w-full bg-no-repeat bg-top bg-cover">
            <div className="backdrop-blur-2xl p-4">
              <div
                className="
              flex gap-x-4 bg-gray-300 bg-opacity-75 
              text-white overflow-hidden rounded-lg
            "
              >
                <Avatar.Root
                  className="
              block
              w-56 h-56 rounded-lg border
              overflow-hidden
            "
                >
                  <Avatar.Image
                    className="
                object-cover
                w-full h-full
              "
                    src={cover}
                    alt={playlist?.name}
                  />
                  <Avatar.Fallback delayMs={300} asChild>
                    <div className="h-full w-full bg-gray-100 flex justify-center items-center">
                      <Icon className="text-[100px]" icon="icon-park-outline:record-disc" />
                    </div>
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="flex flex-col gap-y-4 py-2">
                  <h1 className="text-2xl">{playlist?.name}</h1>
                  <div className="flex items-center gap-x-2">
                    <Link to={to}>
                      <Avatar.Root>
                        <Avatar.Image
                          className="
                          rounded-full object-cover
                          w-10 h-10
                        "
                          src={avatar}
                          alt={playlist?.name}
                        />
                        <Avatar.Fallback>FC</Avatar.Fallback>
                      </Avatar.Root>
                    </Link>
                    <Link
                      className="
                      text-sm text-sky-500 hover:text-sky-700
                      transition-colors
                    "
                      to={to}
                    >
                      {playlist?.creator.nickname}
                    </Link>
                    <span className="text-sm">{createAtText} 创建</span>
                  </div>
                  <p className="flex gap-x-4 text-sm">
                    <span>音乐数: {trackCount}</span>
                    <span>播放数: {playCount}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {
                loadSongs.map(song => <Song
                  key={song.id}
                  id={song.id}
                  name={song.name}
                  album={song.al}
                  alias={song.alia}
                  singers={song.ar}
                  isCopyright
                />
                )
              }
            </ul>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="w-1.5 h-full" orientation="vertical">
        <ScrollArea.Thumb className="w-full rounded-full bg-gray-300 cursor-pointer" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export default PlaylistPage
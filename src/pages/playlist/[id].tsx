import { Icon } from '@iconify-icon/react/dist/iconify.js'
import * as Avatar from '@radix-ui/react-avatar'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import useScrollBottom from '~/hooks/useScrollBottom'
import { debounce } from 'lodash'
import { useForm, FieldValues } from 'react-hook-form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useParams } from 'react-router'
import { useStore } from '~/store'
import { formatFrequency } from '~/utils'
import Song from './components/Song'
import { getPlaylistAllSong } from '~/api/playlist'
import BaseInput from '~/components/Inputs/BaseInput'
import { useToggle } from 'react-use'

type Form = {
  [keyword: string]: string;
} & FieldValues

const PlaylistPage = () => {
  const[isLoading, toggleIsLoading] = useToggle(true)
  const [lovedSongs, lovedPlaylist, lovedSongIds] = useStore(state => [state.lovedSongs, state.lovedPlaylist(), state.lovedSongIds])
  const [currentPlaylistSong, setCurrentPlaylistSong] = useStore(state => [state.currentPlaylistSong, state.setCurrentPlaylistSong])
  const scrollViewRef = useRef<HTMLDivElement | null>(null)
  const limit = 50
  const [stateConfig, setStateConfig] = useState<{
    offset: number
    songs: any[]
  }>({
    offset: 0,
    songs: []
  })
  const { id } = useParams()

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    defaultValues: {
      keyword: ''
    }
  })

  //TODO: 处理忽略大小写
  const onSearch = debounce(handleSubmit((data) => {

    const { keyword } = data
    if(!keyword) {
      setStateConfig(state => ({
        ...state,
        songs: currentPlaylistSong
      }))
      return
    }
    
    const songTitleFiltered = currentPlaylistSong
    .filter(song => song.name.includes(keyword))

    const singerNameFiltered = currentPlaylistSong
    .filter(
      song => song.ar.some(
          (singer: { name:string }) => singer.name.includes(keyword)
        )
      )

    const albumNameFiltered = currentPlaylistSong
    .filter(
      song => song.al.name.includes(keyword)
    )

    const songsFiltered = [...new Set([...songTitleFiltered, ...singerNameFiltered, ...albumNameFiltered])]
    
    setStateConfig(state => ({
      ...state,
      songs: songsFiltered,
    }))
    
  }), 300)

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
    // 当前歌单为我喜欢的音乐
    if (id === lovedPlaylist?.id) {
      setCurrentPlaylistSong(lovedSongs)
      
      setStateConfig(state => ({
        ...state,
        songs: lovedSongs
      }))
      toggleIsLoading(false)
      return
    }

    getPlaylistAllSong(+id, trackCount)
      .then((songs) => {
        setCurrentPlaylistSong(songs)

        setStateConfig(state => ({
          ...state,
          songs
        }))
      })
      .catch((reason) => {
        console.error(reason)
      })
      .finally(() => toggleIsLoading(false))
  }, [id, trackCount, lovedSongs, lovedPlaylist?.id, setCurrentPlaylistSong, toggleIsLoading])

  useEffect(() => {
    if (!scrollViewRef.current) return

    const el = scrollViewRef.current

    el.style.display = 'block'
  }, [])

  useScrollBottom({
    ref: scrollViewRef,
    callback: () => {
      setStateConfig(state => ({
        ...state,
        offset: state.offset + limit
      }))
    },
    time: 800,
    distance: 500
  })

  return (
    <ScrollArea.Root type="scroll" className="h-full">
      <ScrollArea.Viewport ref={scrollViewRef} className="w-full h-full" asChild>
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
          <form className="px-4 pt-2 flex" onSubmit={onSearch}>
            <div className="w-full flex justify-end items-center">
              <BaseInput 
                className="px-1 h-8 text-sm outline-none border-b" 
                name="keyword" 
                register={register} 
                errors={errors} 
                placeholder="搜索歌单音乐"
                onInput={onSearch}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </form>
          <div className="p-4">
            <ul className="space-y-2">
              {
                isLoading && (
                  <li className="py-2">loading</li>
                )
              }
              {
                !isLoading && currentPlaylistSong.length === 0  && (
                  <li className="text-2xl text-gray-500 text-center">暂无歌曲</li>
                )
              }
              {
                loadSongs.map(song => <Song
                  key={song.id}
                  id={song.id}
                  name={song.name}
                  album={song.al}
                  alias={song.alia}
                  singers={song.ar}
                  isCopyright
                  isLoved={lovedSongIds.includes(song.id)}
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
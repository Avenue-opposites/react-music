import { Outlet } from 'react-router'
import { useStore } from '~/store'
import MobileNav from '~/components/Nav/MobileNav'
import DesktopNav from '~/components/Nav/DesktopNav'
import MobileStatusBar from '~/components/Nav/MobileStatusBar'
import DesktopStatusBar from '~/components/Nav/DesktopStatusBar'
import Search from '~/components/Search/Search'
import { useEffect } from 'react'
import { getLoginStatus } from '~/api/login'
import { getAllPlaylist } from '~/api/user'
import MusicPlayer from '~/components/Player/MusicPlayer'
import { getPlaylistAllSong } from '~/api/playlist'


const Root = () => {

  const {
    setUser,
    user,
    setPlaylist,
    setLovedSongs,
    createdPlaylist,
    favoritePlaylist,
    lovedPlaylist,
  } = useStore(state => state)

  useEffect(() => {

    (async () => {
      try {
        // 获取登录状态
        const { data } = await getLoginStatus()
        const { account, profile } = data
        const user = { ...account, ...profile }
        setUser(user)

        // 获取用户歌单
        const playlist = await getAllPlaylist(user.userId)
        setPlaylist(playlist)
        
      } catch (error) {
        console.error('获取登录状态失败', error)
      }
    })()

  }, [setUser, setPlaylist])
  
  const love = lovedPlaylist()

  useEffect(() => {
    
    getPlaylistAllSong(love?.id, love?.trackCount)
    .then((songs) => {
      setLovedSongs(songs)
    })
  }, [love, setLovedSongs])


  return (
    <main className="w-full h-screen overflow-hidden">
      <MobileStatusBar>
        <Search />
      </MobileStatusBar>
      <DesktopStatusBar user={user} />
      <div className="lg:ml-64 h-[calc(100%-144px)]">
        <Outlet />
      </div>
      <MobileNav />
      <DesktopNav
        lovedPlaylist={love}
        favoritePlaylist={favoritePlaylist()}
        createdPlaylist={createdPlaylist()}
      />
      <MusicPlayer />
    </main>
  )
}

export default Root
import { Outlet } from 'react-router'
import { useStore } from '~/store'
import MobileNav from '~/components/Nav/MobileNav'
import DesktopNav from '~/components/Nav/DesktopNav'
import MobileStatusBar from '~/components/Nav/MobileStatusBar'
import DesktopStatusBar from '~/components/Nav/DesktopStatusBar'
import Search from '~/components/Search/Search'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
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

  const navigate = useNavigate()

  useEffect(() => {

    (async () => {
      try {
        // 获取登录状态
        const { data } = await getLoginStatus()

        if(data.code !== 200) {
          navigate('/login', { replace: true })
        }

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

  }, [setUser, setPlaylist, navigate])
  
  // 喜欢的歌单
  const loved = lovedPlaylist()
  // 收藏的歌单
  const favorite = favoritePlaylist()
  // 创建的歌单
  const created = createdPlaylist()

  useEffect(() => {
    
    getPlaylistAllSong(loved?.id, loved?.trackCount)
    .then((songs) => {
      setLovedSongs(songs)
    })
  }, [loved, setLovedSongs])


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
        lovedPlaylist={loved}
        favoritePlaylist={favorite}
        createdPlaylist={created}
      />
      <MusicPlayer />
    </main>
  )
}

export default Root
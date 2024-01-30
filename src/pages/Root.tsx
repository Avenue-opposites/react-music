import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router'
import MobileNav from '~/components/Nav/MobileNav'
import DesktopNav from '~/components/Nav/DesktopNav'
import MobileStatusBar from '~/components/Nav/MobileStatusBar'
import DesktopStatusBar from '~/components/Nav/DesktopStatusBar'
import Search from '~/components/Search/Search'
import { getLoginStatus } from '~/api/login'
import { getAllPlaylist, getLikeSongIdList } from '~/api/user'
import MusicPlayer from '~/components/Player/MusicPlayer'
import { usePlaylistStore, normalize as normalizePlaylist } from '~/store/playlist'
import { useUserStore, normalize as normalizeUser } from '~/store/user'
import { useSongStore } from '~/store/song'


const Root = () => {
  const setLikedSongIds = useSongStore(state => state.setLikedSongIds)
  const { user, setUser } = useUserStore()
  
  const {
    setPlaylist,
    createdPlaylist,
    favoritePlaylist,
    likedPlaylist,
  } = usePlaylistStore()

  const navigate = useNavigate()

  useEffect(() => {

    (async () => {
      try {
        // 获取登录状态
        const { data } = await getLoginStatus()

        if(data.code !== 200) {
          navigate('/login', { replace: true })
        }
        
        // 获取用户信息
        const user = normalizeUser(data, 'profile')
        setUser(user)        
        
        // 获取用户歌单
        const playlist = (await getAllPlaylist(user.id)).map(normalizePlaylist)
        setPlaylist(playlist, user.id)

        // 获取用户喜欢的歌曲id
        const likeSongIds = (await getLikeSongIdList({ uid: user.id })).data.ids        
        setLikedSongIds(likeSongIds)
        
      } catch (error) {
        console.error('获取登录状态失败', error)
      }
    })()

  }, [setUser, setPlaylist, setLikedSongIds, navigate])

  return (
    <main className="w-full h-screen overflow-hidden">
      <MobileStatusBar>
        <Search />
      </MobileStatusBar>
      {user && <DesktopStatusBar user={user} />}
      <div className="lg:ml-64 h-[calc(100%-144px)]">
        <Outlet />
      </div>
      <MobileNav />
      {
        likedPlaylist &&
        <DesktopNav
          likedPlaylist={likedPlaylist}
          favoritePlaylist={favoritePlaylist}
          createdPlaylist={createdPlaylist}
        />
      }
      <MusicPlayer />
    </main>
  )
}

export default Root
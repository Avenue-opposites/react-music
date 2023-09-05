import useNavRoutes from '~/hooks/useNavRoutes'
import DesktopNavItem from './DesktopNavItem'
import CollapsiblePlaylist from './Playlist/CollapsiblePlaylist'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Separator from '../Separator'
import { useMemo } from 'react'

interface DesktopNavProps {
  createdPlaylist: any[];
  favoritePlaylist: any[];
  lovedPlaylist: any
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  createdPlaylist,
  favoritePlaylist,
  lovedPlaylist
}) => {
  const routes = useNavRoutes('desktop')
  const id = useMemo(() => lovedPlaylist?.id, [lovedPlaylist])  

  return (
    <div
      className="
        h-[calc(100%-80px)] w-64
        top-0 left-0 z-10
        fixed hidden lg:block
        text-gray-700 bg-gray-100
      "
    >
      <ScrollArea.Root className="h-full">
        <ScrollArea.Viewport className="h-full">
          <div className="w-64 p-4 flex flex-col gap-y-2">
            {routes.map((route) => <DesktopNavItem key={route.href} {...route} />)}
            <DesktopNavItem href={`/playlist/${id}`} icon="material-symbols:heart-check-outline-rounded">我喜欢的音乐</DesktopNavItem>
            <Separator />
            <CollapsiblePlaylist title="创建的歌单" playlist={createdPlaylist} />
            <CollapsiblePlaylist title="收藏的歌单" playlist={favoritePlaylist} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.ScrollAreaScrollbar 
          className="w-1.5 h-full" 
          orientation="vertical"
        >
          <ScrollArea.ScrollAreaThumb 
            className="w-full rounded-full bg-gray-300 cursor-pointer" 
          />
        </ScrollArea.ScrollAreaScrollbar>
      </ScrollArea.Root>
    </div>
  )
}

export default DesktopNav
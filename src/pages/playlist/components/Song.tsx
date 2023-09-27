import { Icon } from '@iconify-icon/react/dist/iconify.js'
import * as Avatar from '@radix-ui/react-avatar'
import clsx from 'clsx'
import { Fragment, memo } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { checkMusic } from '~/api/song'
import { useStore } from '~/store'
import { getMusic } from '~/api/song'
import { getLyric } from '~/api/lyric'
import Love from './Love'

interface SongProps {
  id: number;
  name: string;
  album: any;
  singers: any[];
  alias: string[];
  isCopyright: boolean;
  isLoved: boolean;
}

const Song: React.FC<SongProps> = memo(({
  id,
  name,
  album,
  singers,
  alias,
  isCopyright,
  isLoved
}) => {
  const setCurrentSong = useStore(state => state.setCurrentSong)
  const aliasText = alias.join('')
  const singersText = singers.map(singer => singer.name).join(' / ')
  const image = album?.picUrl
  const playHandle = async () => {
    if (!isCopyright) return

    const { data: { success, message } } = await checkMusic(id)

    if (success) {
      const { data: [song] } = await getMusic([id])
      const { data: { lrc, tlyric } } = await getLyric(id)

      setCurrentSong({
        id,
        name,
        image,
        singers,
        album,
        lyrics: lrc.lyric,
        lyricsTranslation: tlyric.lyric,
        url: song.url,
      })
    } else {
      toast.error(message)
    }
  }

  return (
    <li
      onDoubleClick={playHandle}
      className={clsx(
        `group
        rounded overflow-hidden transition-colors
        odd:bg-gray-100 hover:bg-gray-300
        flex items-center gap-x-2 cursor-default
        pr-2
        `,
        !isCopyright && 'opacity-25 cursor-not-allowed'
      )}
    >
      <Avatar.Root
        className="
          relative
          w-14 h-14 inline-block
          rounded overflow-hidden
        "
      >
        <Avatar.Image
          className="
        object-cover
        w-full h-full
      "
          src={image}
          alt={album?.name}
        />
        <div
          className="
            absolute top-0 left-0 w-full h-full transition-opacity
            flex justify-center items-center opacity-0
            bg-black bg-opacity-50 group-hover:opacity-100
          "
        >
          <Icon onClick={playHandle} className="text-white text-[48px]" icon="material-symbols:play-arrow-rounded" />
        </div>
        <Avatar.Fallback delayMs={300} asChild>
          <div className="h-full w-full bg-gray-100 flex justify-center items-center">
            <Icon className="text-2xl" icon="icon-park-outline:record-disc" />
          </div>
        </Avatar.Fallback>
      </Avatar.Root>
      <span className="lg:w-96 truncate">
        {name}
        &nbsp;
        {alias.length > 0 && (<span title={aliasText} className="text-gray-500">({aliasText})</span>)}
      </span>
      <span title={singersText} className="lg:w-32 truncate text-gray-600">
        {
          singers.map((singer, i) => (
            <Fragment key={singer.id}>
              <Link to={`/user/${singer.id}`}>
                {singer.name}
              </Link>
              {i !== singers.length - 1 && (<span className="text-gray-500">&nbsp;/&nbsp;</span>)}
            </Fragment>
          ))
        }
      </span>
      <span className="lg:w-32 truncate text-gray-600">
        <Link to={`/album/${id}`} title={album?.name}>
          {album?.name}
        </Link>
      </span>
      <div className="flex items-center">
        <span>
          <Love love={isLoved} />
        </span>
        <span className="w-6 h-6 text-2xl text-gray-500">
          <Icon icon="material-symbols:download" />
        </span>
      </div>
    </li>
  )
})

export default Song
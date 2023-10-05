import { Link } from 'react-router-dom'
import { Fragment, useEffect, useRef, useState } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Disk from './Disk'
import clsx from 'clsx'
import { Icon } from '@iconify-icon/react/dist/iconify.js'
import { formatTime, Lyric } from '~/utils'
import { comment, getMusicComment } from '~/api/comment'
import SongComment, { CommentHandler } from './SongComment'
import Button from '../Button/Button'
import { ClipLoader } from 'react-spinners'
import useScrollBottom from '~/hooks/useScrollBottom'
import CommentInput, { SendHandler } from '../Inputs/CommentInput'
import { Comment as CommentType, CommentAction } from '~/types/comment'
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

interface Comment {
  beReplied: any[];
  commentId: number;
  content: string;
  likedCount: number;
  ipLocation: {
    location: string;
  }
  owner: boolean;
  parentCommentId: number;
  liked: boolean;
  time: number;
  timeStr: string;
  user: any;
  pendantData?: {
    imageUrl: string;
  }
}

interface SongCommentState {
  userId: number;
  comments: Comment[];
  hotComments: Comment[];
  topComments: Comment[];
  isMusician: boolean;
  more: boolean;
  total: number;
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
  const limit = 20
  const offsetRef = useRef(0)
  const [commentId, setCommentId] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [songCommentState, setSongCommentState] = useState<SongCommentState>()
  const scrollViewportRef = useRef<HTMLDivElement | null>(null)
  const placeholder = `评论 ${name}：`

  const handleSendComment: SendHandler = (content) => {
    comment({
      id,
      type: CommentType.Song,
      action: CommentAction.Send,
      content
    })
    .then(({ data }) => {
      console.log(data)
    })
  }

  const handleComment: CommentHandler = (id) => {
    if(!id) return
    if(commentId === id) {
      setCommentId(0)
    }else {
      setCommentId(id)
    }
  }

  useScrollBottom({
    ref: scrollViewportRef,
    callback: () => {
      if (!songCommentState?.more) return
      setIsLoading(true)
      offsetRef.current += limit

      getMusicComment({ id, offset: offsetRef.current })
        .then(({ data }) => {
          // console.log(data)

          setSongCommentState({
            ...songCommentState,
            more: data.more,
            comments: [...songCommentState.comments, ...data.comments],
          })
        })
        .finally(() => setIsLoading(false))
    }
  })

  //获取歌曲评论
  useEffect(() => {
    if (!id) return

    getMusicComment({ id })
      .then(({ data }) => {
        setSongCommentState(data)
      })
      .finally(() => setIsLoading(false))

  }, [id])

  if (!id) return

  return (
    <ScrollArea.Root type="scroll" className="w-full h-[calc(100%-62px)]">
      <ScrollArea.Viewport ref={scrollViewportRef} className="w-full h-full">
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
              <LyricArea 
                lyrics={lyrics} 
                lyricsTranslation={lyricsTranslation}
                onTimeChange={onTimeChange}
                time={time}
              />
            </div>
          </div>
          <div className="p-4 flex gap-x-8">
            {/* 歌曲评论 */}
            <div className="w-[max(700px,70%)]">
              {/* 评论 */}
              <div className="mb-4 border-b">
                <h3 className="text-xl font-bold">评论</h3>
                <CommentInput placeholder={placeholder} onSend={handleSendComment} />
              </div>
              {/* 热评 */}
              <div>
                <h2 className="text-xl font-bold">热评</h2>
                <ul className="space-y-4">
                  {
                    songCommentState?.hotComments.map(({
                      commentId : cid,
                      content,
                      likedCount,
                      liked,
                      user,
                      time,
                      timeStr,
                      beReplied,
                      ipLocation,
                      pendantData,
                      owner
                    }) => (
                      <SongComment
                        key={cid}
                        id={cid}
                        songId={id}
                        isComment={cid === commentId}
                        avatarFrameSrc={pendantData?.imageUrl}
                        content={content}
                        likedCount={likedCount}
                        liked={liked}
                        user={user}
                        time={time}
                        timeStr={timeStr}
                        beReplied={beReplied}
                        onComment={handleComment}
                        isOwner={owner}
                        ip={ipLocation.location}
                      />
                    ))
                  }
                </ul>
                <div className="my-4 flex justify-end">
                  <Button
                    roundType="full"
                    className="
                      px-8 text-center text-base
                     text-sky-500 border border-sky-500
                     hover:bg-sky-500 hover:text-white
                    "
                    variant="custom"
                  >
                    更多
                    <Icon icon="material-symbols:arrow-forward-ios-rounded" />
                  </Button>
                </div>
              </div>
              {/* 最新评论 */}
              <div>
                <h2 className="mb-4 text-xl font-bold">最新评论（{songCommentState?.total}）</h2>
                <ul className="space-y-4">
                  {
                    songCommentState?.comments.map(({
                      commentId: cid,
                      owner,
                      content,
                      likedCount,
                      liked,
                      user,
                      time,
                      timeStr,
                      beReplied,
                      ipLocation,
                      pendantData
                    }) => (
                      <SongComment
                        key={cid}
                        id={cid}
                        songId={id}
                        isComment={cid === commentId}
                        avatarFrameSrc={pendantData?.imageUrl}
                        isOwner={owner}
                        content={content}
                        likedCount={likedCount}
                        liked={liked}
                        user={user}
                        time={time}
                        timeStr={timeStr}
                        beReplied={beReplied}
                        onComment={handleComment}
                        ip={ipLocation.location}
                      />
                    ))
                  }
                </ul>
                <div className={clsx('mt-4 justify-center items-center gap-x-1', isLoading ? 'flex' : 'hidden')}>
                  <ClipLoader size={24} />
                  加载中......
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">包含这首歌的歌单</h2>
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

// 歌词区域组件
interface LyricAreaProps extends Pick<SongDetailsProps, 'lyrics' | 'lyricsTranslation' | 'onTimeChange' | 'time'> { }

const LyricArea: React.FC<LyricAreaProps> = ({
  lyrics,
  lyricsTranslation,
  onTimeChange,
  time
}) => {
  const [isTranslate, setIsTranslate] = useState(false)
  const LyricScrollViewportRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const activeLyricIndex = lyrics.findIndex(({ time: t }) => time <= t) - 1
  let isScrolling = false

  const scrollHandler = () => {
    isScrolling = true
    setTimeout(() => {
      isScrolling = false
    }, 500)
  }

  const generateLyricView = (lyrics: Lyric[]) => {
    if (!lyrics.length) {
      if (isTranslate) {
        return <li>暂无翻译歌词</li>
      }
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

  //设置歌词滚动
  useEffect(() => {
    const scrollViewport = LyricScrollViewportRef.current
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
    <Fragment>
      {/* 歌词 */}
      <ScrollArea.Root className="relative mt-4">
        <ScrollArea.Viewport ref={LyricScrollViewportRef} onScroll={scrollHandler} className="w-full h-80 xl:h-[500px]">
          <ul ref={listRef} className="py-4 text-lg text-gray-500">
            {generateLyricView(isTranslate ? lyricsTranslation : lyrics)}
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
    </Fragment>
  )
}
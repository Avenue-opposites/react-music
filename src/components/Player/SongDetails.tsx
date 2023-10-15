import { Link } from 'react-router-dom'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Disk from './Disk'
import clsx from 'clsx'
import { Icon } from '@iconify-icon/react/dist/iconify.js'
import { formatTime, Lyric } from '~/utils'
import { GETCommentQuery, comment, getComment } from '~/api/comment'
import SongComment, { BeReplied, CommentHandler } from '../Comment/SongComment'
import Button from '../Button/Button'
import useScrollBottom from '~/hooks/useScrollBottom'
import CommentInput, { SendHandler } from '../Inputs/CommentInput'
import { Comment as CommentType, CommentSort, CommentAction } from '~/types/comment'
import { useToggle } from 'react-use'
import Separator from '../Separator'
import toast from 'react-hot-toast'
import SongReplyComments from '../Comment/SongReplyComments'
import Loading from '../Loading/Loading'

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
export interface User {
  avatarUrl: string;
  nickname: string;
  userId: number;
  vipRights: {
    associator: {
      iconUrl: string;
    }
    musicPackage: {
      iconUrl: string;
    }
  }
}

export interface Comment {
  commentId: number;
  content: string;
  richContent: string;
  likedCount: number;
  ipLocation: {
    location: string;
  }
  owner: boolean;
  parentCommentId: number;
  liked: boolean;
  time: number;
  timeStr: string;
  user: User;
  beReplied: BeReplied[] | null;
  replyCount: number;
  pendantData?: {
    imageUrl: string;
  }
}

export interface SongCommentState {
  comments: Comment[];
  hasMore: boolean;
  cursor: string;
  sortType: CommentSort;
  totalCount: number;
}

const commentSortMap = {
  [CommentSort.Recommended]: '推荐',
  [CommentSort.Hot]: '最热',
  [CommentSort.Time]: '最新',
}

const commentSortType = [CommentSort.Recommended, CommentSort.Hot, CommentSort.Time]

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
  const pageSize = 20
  const pageNoRef = useRef(1)
  const [isOpen, setIsOpen] = useState(false)
  // 当前准备回复的评论id
  const [commentId, setCommentId] = useState<number>()
  //回复评论id
  const [replyCommentId, setReplyCommentId] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [songCommentState, setSongCommentState] = useState<SongCommentState>({
    comments: [],
    hasMore: true,
    cursor: '',
    sortType: CommentSort.Recommended,
    totalCount: 0
  })
  const scrollViewportRef = useRef<HTMLDivElement | null>(null)
  const placeholder = `评论 ${name}：`

  // 处理评论排序
  const handleCommentSort = (type: CommentSort) => {
    setSongCommentState({
      ...songCommentState,
      sortType: type,
    })
  }

  // 处理评论发送
  const handleCommentSend: SendHandler = (content) => {
    return comment({
      id,
      type: CommentType.Song,
      action: CommentAction.Send,
      content,
    })
      .then(({ data }) => {
        setSongCommentState({
          ...songCommentState,
          comments: [...data.comment, ...songCommentState.comments],
        })
        toast.success('发布成功')
      })
      .catch(() => {
        toast.error('发布失败')
      })
  }

  // 处理评论显示
  const handleComment: CommentHandler = (id) => {
    if (!id) return
    if (commentId === id) {
      setCommentId(undefined)
    } else {
      setCommentId(id)
    }
  }

  const handleShowReplyComment = (id: number) => {
    setIsOpen(true)
    setReplyCommentId(id)
  }

  // 当滚动到底部时获取评论
  useScrollBottom({
    ref: scrollViewportRef,
    callback: () => {
      console.log(songCommentState)
      
      if (!songCommentState?.hasMore) return
      setIsLoading(true)
      pageNoRef.current += 1

      const sortType = songCommentState.sortType
      const query: GETCommentQuery = {
        id,
        type: CommentType.Song,
        pageNo: pageNoRef.current,
        pageSize,
        sortType: sortType,
      }

      if (sortType === CommentSort.Time) {
        query.cursor = songCommentState.cursor
      }

      getComment(query)
        .then(({ data }) => {          
          setSongCommentState({
            ...songCommentState,
            hasMore: data.hasMore,
            sortType,
            comments: [...songCommentState.comments, ...data.comments],
          })
        })
        .finally(() => setIsLoading(false))
    }
  })

  //获取歌曲评论
  useEffect(() => {
    if (!id) return

    const sortType = songCommentState.sortType

    getComment({
      id,
      type: CommentType.Song,
      sortType,
      pageNo: pageNoRef.current,
    })
      .then(({ data }) => {
        // console.log(data)
        setSongCommentState({
          ...data,
          sortType,
        })
      })
      .finally(() => setIsLoading(false))
  }, [id, songCommentState.sortType])

  if (!id) return

  return (
    <Fragment>
      <Transition.Root
        className="hidden lg:block relative z-50"
        show={isOpen}
      >
        <Transition.Child
          className="
            fixed bg-gray-100 right-0 top-0 
            h-[calc(100vh-80px)] w-[30%] rounded-l-lg
            transition-transform shadow-xl
          "
          enter="ease-out duration-300"
          enterFrom="translate-x-full"
          leave="ease-in duration-200"
          enterTo="translate-x-0"
          leaveTo="translate-x-full"
        >
          <SongReplyComments
            replyCommentId={replyCommentId}
            songId={id}
            onClose={() => setIsOpen(false)}
          />
        </Transition.Child>
      </Transition.Root>
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
                {/* 用户评价 */}
                <div className="mb-4 border-b">
                  <h3 className="text-xl font-bold">评论</h3>
                  <CommentInput
                    onSend={handleCommentSend}
                    placeholder={placeholder}
                  />
                </div>
                {/* 评论区 */}
                <div>
                  <h2
                    className="flex h-8 mb-4 justify-between items-center text-xl font-bold">
                    <span>{commentSortMap[songCommentState.sortType]}评论（所有评论{songCommentState.totalCount}条）</span>
                    <div className="h-1/2 flex items-center text-sm text-sky-900">
                      {commentSortType.map((sortType, i) => (
                        // 评论排序
                        <Fragment key={sortType}>
                          <span
                            onClick={() => handleCommentSort(sortType)}
                            className={clsx(
                              'cursor-pointer border-separate',
                              sortType === songCommentState.sortType && 'text-sky-500'
                            )}
                          >
                            {commentSortMap[sortType]}
                          </span>
                          {i !== commentSortType.length - 1 && <Separator className="mx-2 bg-sky-900" />}
                        </Fragment>
                      ))}
                    </div>
                  </h2>
                  <ul className="space-y-4">
                    {
                      songCommentState?.comments.map(({
                        commentId: cid,
                        owner,
                        content,
                        richContent,
                        replyCount,
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
                          key={time}
                          id={cid}
                          songId={id}
                          isComment={cid === commentId}
                          avatarFrameSrc={pendantData?.imageUrl}
                          isOwner={owner}
                          content={richContent || content}
                          replyCount={replyCount}
                          likedCount={likedCount}
                          liked={liked}
                          user={user}
                          time={time}
                          timeStr={timeStr}
                          beReplied={beReplied}
                          onShowReplyComment={handleShowReplyComment}
                          onComment={handleComment}
                          ip={ipLocation.location}
                        />
                      ))
                    }
                  </ul>
                  <Loading size={24} isLoading={isLoading} />
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
    </Fragment>
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
  const [isTranslate, toggleTranslate] = useToggle(false)
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
            <LyricList
              lyrics={lyrics}
              lyricsTranslation={lyricsTranslation}
              isTranslate={isTranslate}
              activeLyricIndex={activeLyricIndex}
              onTimeChange={onTimeChange}
            />
          </ul>
        </ScrollArea.Viewport>
        <Button
          className="w-8 h-8 absolute bottom-0 right-0"
          roundType="full"
          onClick={toggleTranslate}
        >
          {isTranslate ? '原' : '译'}
        </Button>
        <ScrollArea.Scrollbar className="w-1.5 h-full" orientation="vertical">
          <ScrollArea.Thumb className="w-full rounded-full bg-gray-300 cursor-pointer" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Fragment>
  )
}

interface LyricListProps extends Omit<LyricAreaProps, 'time'> {
  isTranslate: boolean;
  activeLyricIndex: number;
}

const LyricList: React.FC<LyricListProps> = ({
  lyrics,
  lyricsTranslation,
  isTranslate,
  activeLyricIndex,
  onTimeChange
}) => {
  const l = isTranslate ? lyricsTranslation : lyrics

  if (!lyrics.length) {
    if (isTranslate) {
      return <li>暂无翻译歌词</li>
    }
    return <li>暂无歌词</li>
  }

  return (
    l.map((line, i) => (
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
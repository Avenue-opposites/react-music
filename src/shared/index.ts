import { getLyric } from '~/api/lyric'
import { checkMusic, getMusic } from '~/api/song'
import { parseLyric } from '~/utils'

// 获取歌曲url
export async function getSongUrl(id: number) {
  const { data: { success, message } } = await checkMusic(id)

  if (!success) {
    return Promise.reject(message)
  }

  const { data: [song] } = await getMusic([id])
  const { data: { lrc, tlyric } } = await getLyric(id)
  console.log(lrc,tlyric)
  
  return {
    url: song.url as string,
    lyrics: parseLyric(lrc.lyric),
    translatedLyrics: parseLyric(tlyric.lyric)
  }
}
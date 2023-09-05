import api from '..'

export async function getUserPlaylists(
  query: {
    uid: number;
    limit?: number;
    offset?: number
  }
) {
  const { uid, limit = 30, offset = 0 } = query

  return api.get(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`)
}

export const getAllPlaylist = async (uid: number) => {
  try {
    const playlists = []
    let offset = 0
    let isMore = true
    while (isMore) {
      const { data } = await getUserPlaylists({ uid, offset })

      isMore = data.more
      playlists.push(...data.playlist)
      offset++
    }

    return playlists
  } catch (error) {
    throw new Error('获取歌单失败')
  }
}
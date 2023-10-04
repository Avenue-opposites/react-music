import api from '..'

// 获取用户歌单
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

// 获取用户所有歌单
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

// 获取用户喜欢歌曲id
export async function getLikeSongIdList(query: {
  uid: number;
}) {
  const { uid } = query
  return api.get(`/likelist?uid=${uid}`)
}
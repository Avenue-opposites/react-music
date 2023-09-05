import api from '..'

export async function getPlaylistSong(id: number, limit: number, offset: number) {
  return api.get(`/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`)
}

export async function getPlaylistAllSong(id: number, total: number) {
  const result = []
  const limit = 1000
  let offset = 0
  while (offset < total) {
    const { data } = await getPlaylistSong(id, limit, offset)
    result.push(...data.songs)
    offset += limit
  }

  return result
}
import api from '..'

export async function getLyric(id: number) {
  return api.get(`/lyric?id=${id}`)
}
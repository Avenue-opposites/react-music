import { Level } from '~/types/song'
import api from '..'

export async function checkMusic(id: number) {
  return api.get(`/check/music?id=${id}`)  
}

export async function getMusic(ids: number[], level: Level = Level.标准) {
  const id = ids.join(',')
  return api.get(`/song/url/v1?id=${id}&level=${level}`)
}
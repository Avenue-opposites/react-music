import { create } from 'zustand'

type RecordState = Record<string, any>

export type State = {
  user: RecordState,
  lovedSongIds: number[],
  playlist: RecordState[],
  lovedSongs: RecordState[],
  currentPlaylistSong: RecordState[],
  currentSong: {
    id: number,
    name: string,
    image: string,
    singers: any[],
    album: any,
    lyrics: string,
    lyricsTranslation: string,
    url: string,
  } 
}

export type Action = {
  setUser: (user: RecordState) => void,
  setLovedSongIds: (lovedSongIds: number[]) => void,
  setPlaylist: (playlist: RecordState[]) => void,
  setCurrentSong: (currentSong: State['currentSong']) => void,
  setLovedSongs: (lovedSongs: RecordState[]) => void,
  setCurrentPlaylistSong: (currentPlaylistSong: RecordState[]) => void,
  createdPlaylist: () => RecordState[],
  lovedPlaylist: () => RecordState,
  favoritePlaylist: () => RecordState[],
  getPlaylistById: (id: number) => RecordState | undefined
}

const initialState: State = {
  user: {},
  lovedSongIds: [],
  playlist: [],
  lovedSongs: [],
  currentPlaylistSong: [],
  currentSong: {
    id: 0,
    name: '',
    image: '',
    singers: [],
    album: {},
    lyrics: '',
    lyricsTranslation: '',
    url: '',
  }
}

export const useStore = create<State & Action>((set, get) => ({
  ...initialState,
  // set
  setUser: (user) => set({ user }),
  setLovedSongIds: (lovedSongIds) => set({ lovedSongIds }),
  setPlaylist: (playlist) => set({ playlist }),
  setCurrentSong: (currentSong) => set({ currentSong }),
  setLovedSongs: (lovedSongs) => set({ lovedSongs }),
  setCurrentPlaylistSong: (currentPlaylistSong) => set({ currentPlaylistSong }),
  // get
  lovedPlaylist: () => get().playlist[0],
  createdPlaylist: () => get().playlist.slice(1).filter(item => item.creator.userId === get().user.userId),
  favoritePlaylist: () => get().playlist.filter(item => item.subscribed),
  getPlaylistById: (id: number) => get().playlist.find(item => item.id === id),
}))

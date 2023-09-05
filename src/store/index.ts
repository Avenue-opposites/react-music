import { create } from 'zustand'

type RecordState = Record<string, any>

export type State = {
  user: RecordState,
  playlist: RecordState[],
  lovedSongs: RecordState[],
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
  setPlaylist: (playlist: RecordState[]) => void,
  setCurrentSong: (currentSong: State['currentSong']) => void
  setLovedSongs: (lovedSongs: RecordState[]) => void
  createdPlaylist: () => RecordState[],
  lovedPlaylist: () => RecordState,
  favoritePlaylist: () => RecordState[],
  getPlaylistById: (id: number) => RecordState | undefined
}

const initialState: State = {
  user: {},
  playlist: [],
  lovedSongs: [],
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
  setPlaylist: (playlist) => set({ playlist }),
  setCurrentSong: (currentSong) => set({ currentSong }),
  setLovedSongs: (lovedSongs) => set({ lovedSongs }),
  // get
  lovedPlaylist: () => get().playlist[0],
  createdPlaylist: () => get().playlist.slice(1).filter(item => item.creator.userId === get().user.userId),
  favoritePlaylist: () => get().playlist.filter(item => item.subscribed),
  getPlaylistById: (id: number) => get().playlist.find(item => item.id === id),
}))

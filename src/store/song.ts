import { create } from 'zustand'

export interface Singer {
  id: number;
  name: string;
}

export interface Album {
  id: number;
  name: string;
  picture: string;
}

export interface Song {
  id: number;
  name: string;
  alias: string[];
  singers: Singer[];
  album: Album;
}

export interface Lyric {
  time: number;
  lyric: string;
}

export interface SongDetail {
  lyrics: Lyric[];
  translatedLyrics: Lyric[];
  url: string;
}

export interface State {
  likedSongIds: number[];
  currentPlaylistSong: Song[];
  currentPlayedSong?: Song & SongDetail;
}

export interface Action {
  setLikedSongIds: (likedSongIds: number[]) => void
  setCurrentPlaylistSong: (currentPlaylistSong: Song[]) => void
  setCurrentPlayedSong: (currentSong: Song & SongDetail) => void
}

const initialState: State = {
  likedSongIds: [],
  currentPlaylistSong: [],
}

export const useSongStore = create<State & Action>((set) => ({
  ...initialState,
  setLikedSongIds: (likedSongIds) => set({ likedSongIds }),
  setCurrentPlaylistSong: (currentPlaylistSong) => set({ currentPlaylistSong }),
  setCurrentPlayedSong: (currentPlayedSong) => set({ currentPlayedSong }),
}))

export function normalize(song: any): Song {
  const {
    id,
    name,
    al,
    ar,
    alia
  } = song

  return {
    id,
    name,
    singers: ar,
    album: {
      id: al.id,
      name: al.name,
      picture: al.picUrl
    },
    alias: alia
  }
}
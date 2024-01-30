import { create } from 'zustand'
import { User, normalize as normalizeUser } from './user'

// 歌单
export interface Playlist {
  id: number;
  name: string;
  coverImage: string;
  createdAt: number;
  updatedAt: number;
  description: string;
  playCount: number;
  subscribedCount: number;
  trackCount: number;
  creator: User;
  subscribed: boolean;
  tags: string[];
  subscribers: User[];
} 

export interface State {
  playlist: Playlist[],
  createdPlaylist: Playlist[],
  favoritePlaylist: Playlist[],
  likedPlaylist?: Playlist,
}

export interface Action {
  setPlaylist: (playlist: Playlist[], userId: number) => void,
  getPlaylistById: (id: number) => Playlist | undefined
}

const initialState: State = {
  playlist: [],
  createdPlaylist: [],
  favoritePlaylist: [],
}

export const usePlaylistStore = create<State & Action>((set, get) => ({
  ...initialState,
  setPlaylist(playlist: Playlist[], userId: number) {
    set({ 
      playlist,
      createdPlaylist: playlist.slice(1).filter(item => item.creator.id === userId),
      favoritePlaylist: playlist.filter(item => item.subscribed),
      likedPlaylist: playlist[0]
    })
  },
  getPlaylistById: id => get().playlist.find(item => item.id === id)
}))

  // set
  // setLovedSongIds: (lovedSongIds) => set({ lovedSongIds }),
  // setPlaylist: (playlist) => set({ playlist }),
  // setCurrentSong: (currentSong) => set({ currentSong }),
  // setLovedSongs: (lovedSongs) => set({ lovedSongs }),
  // setCurrentPlaylistSong: (currentPlaylistSong) => set({ currentPlaylistSong }),
  // // get
  // lovedPlaylist: () => get().playlist[0],
  // createdPlaylist: () => get().playlist.slice(1).filter(item => item.creator.userId === get().user.userId),
  // favoritePlaylist: () => get().playlist.filter(item => item.subscribed),
  // getPlaylistById: (id: number) => get().playlist.find(item => item.id === id),

export function normalize(playlist: any): Playlist {
  const {
    id,
    name,
    coverImgUrl,
    description,
    creator,
    createTime,
    updateTime,
    trackCount,
    playCount,
    subscribedCount,
    tags,
    subscribers,
    subscribed
  } = playlist
  
  return {
    id,
    name,
    description,
    coverImage: coverImgUrl, 
    creator: normalizeUser(creator),
    createdAt: createTime,
    updatedAt: updateTime,
    trackCount,
    playCount,
    subscribedCount,
    subscribed,
    tags,
    subscribers: subscribers.map(normalizeUser),
  }
}
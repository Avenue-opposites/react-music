import { create } from 'zustand'

export interface User {
  id: number,
  nickname: string,
  avatar: string,
  background: string,
  gender: number,
  signature: string,
}

interface State {
  user?: User,
}

interface Action {
  setUser(user: Record<string, any>): void,
}

export const useUserStore = create<State & Action>((set) => ({
  setUser: (user: User) => set({ user }),
}))

export function normalize(user: any, type: 'profile' | 'default' = 'default'): User {
  const profile = type === 'profile' ? user.profile : user
  
  return {
    id: profile.userId,
    nickname: profile.nickname,
    avatar: profile.avatarUrl,
    background: profile.backgroundUrl,
    gender: profile.gender,
    signature: profile.signature
  }
}
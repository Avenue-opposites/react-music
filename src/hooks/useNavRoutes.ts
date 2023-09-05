import { useMemo } from 'react'

type NavRoutesType = 'mobile' | 'desktop'

export default function useNavRoutes(type: NavRoutesType) {
  const routes = useMemo(() => ({
    mobile: [
      {
        icon: 'teenyicons:react-solid',
        href: '/',
        children: '发现'
      },
      {
        icon: 'material-symbols:podcasts-rounded',
        href: '/podcasts',
        children: '播客'
      },
      {
        icon: 'lucide:heart-pulse',
        href: '/roam',
        children: '漫游'
      },
      {
        icon: 'ph:wechat-logo-bold',
        href: '/community',
        children: '社区'
      },
      {
        icon: 'iconamoon:music-2',
        href: '/me',
        children: '我的'
      }
    ],
    desktop: [
      {
        icon: 'teenyicons:react-solid',
        href: '/',
        children: '发现音乐'
      },
      {
        icon: 'material-symbols:podcasts-rounded',
        href: '/podcasts',
        children: '播客'
      },
      {
        icon: 'lucide:heart-pulse',
        href: '/roam',
        children: '私人漫游'
      },
      {
        icon: 'iconoir:youtube',
        href: '/video',
        children: '视频'
      },
      {
        icon: 'mingcute:user-follow-line',
        href: '/follow',
        children: '关注'
      }
    ]
  }), [])

  return routes[type]
}
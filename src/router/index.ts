import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import Root from '~/pages/Root'
import Login from '~/pages/login'
import Discover from '~/pages/discover'
import NotFound404 from '~/pages/error/NotFound404'


const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    ErrorBoundary: NotFound404,
    children: [
      {
        path: '',
        Component: Discover
      },
      {
        path: 'podcasts',
        Component: lazy(() => import('~/pages/podcasts'))
      },
      {
        path: 'playlist',
        children: [
          {
            path: ':id',
            Component: lazy(() => import('~/pages/playlist/[id]'))
          },
        ]
      }
    ]
  },
  {
    path: '/login',
    Component: Login,
  }
])

export default router
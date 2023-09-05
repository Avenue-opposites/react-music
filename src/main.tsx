import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import ReactDOM from 'react-dom/client'
import * as Tooltip from '@radix-ui/react-tooltip'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import Loading from './components/Loading/Loading'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <Suspense fallback={<Loading />}>
      <Tooltip.Provider>
        <RouterProvider router={router} />
      </Tooltip.Provider>
    </Suspense>
  </React.StrictMode>,
)

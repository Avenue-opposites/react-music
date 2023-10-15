import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import ReactDOM from 'react-dom/client'
import * as Tooltip from '@radix-ui/react-tooltip'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import Loading from './components/Loading/Loading'

const fallback = (
  <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
    <Loading size={48} isLoading />
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <Suspense fallback={fallback}>
      <Tooltip.Provider>
        <RouterProvider router={router} />
      </Tooltip.Provider>
    </Suspense>
  </React.StrictMode>,
)

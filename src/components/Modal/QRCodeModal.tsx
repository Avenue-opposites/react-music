import { useEffect, useState, useRef, useCallback } from 'react'
import { useInterval, useLocalStorage } from 'react-use'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
import {
  getQRCode,
  getQRCodeKey,
  getQRCodeStatus
} from '~/api/QRCode'
import Modal from '~/components/Modal/Modal'
import QRCode from '../Auth/QRCode'
import { State } from '~/types/QRCode'

interface QRCodeModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen = false,
  onClose
}) => {
  const [, setCookie] = useLocalStorage('cookie', '')
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState<State>(801)
  const ref = useRef({
    key: '',
    img: '',
  })
  const delay = 500

  const close = () => {
    setIsRunning(false)
    setLoading(false)
    setCode(801)
    onClose()
  }

  const refresh = useCallback(async () => {
    setLoading(true)
  
    const { data: { unikey } } = await getQRCodeKey()
    ref.current.key = unikey
    const { data: { qrimg } } = await getQRCode(unikey)
    ref.current.img = qrimg
    
    setLoading(false)
    setIsRunning(true)
  }, [ref])

  // 获取二维码图片
  useEffect(() => {
    if(!isOpen) return
    
    refresh()
  }, [isOpen, refresh])

  // 判断二维码状态
  useEffect(() => {
    switch (code) {
      //扫码成功
      case State.Success: {
        toast.success('登录成功')
        setIsRunning(false)
        navigate('/', { replace: true })
        break
      }
      //二维码已过期
      case State.Expired: {
        toast.error('二维码已过期')
        setIsRunning(false)
        break
      }
    }  
  }, [code, navigate])

  useInterval(() => {
    getQRCodeStatus(ref.current.key)
    .then(({ data }) => {
      const code = data.code
      if(code === State.Success) {
        //设置cookie
        document.cookie = data.cookie
        setCookie(data.cookie)
      }
      setCode(code)
    })
    
  }, isRunning ? delay : null)

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <QRCode
        onRefresh={refresh}
        stateCode={code}
        isLoading={isLoading} 
        src={ref.current.img} 
      />
    </Modal>
  )
}
 
export default QRCodeModal
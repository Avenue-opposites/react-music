import { Fragment, useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { debounce } from 'lodash'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Input from '../Inputs/Input'
import Button from '../Button/Button'
import QRCodeModal from '../Modal/QRCodeModal'
import Loading from '~/components/Loading/Loading'
import { Store } from '~/store/user'

import { 
  visitorLogin, 
  getCaptcha, 
  verifyCaptcha,
  phoneCaptchaLogin, 
} from '~/api/login'

type Variant = 'LOGIN' | 'REGISTER'
type OtherLoginAction = 'visitor' | 'scan'
type Form = {
  phone: string,
  captcha: string,
  password: string,
  nickname: string,
} | FieldValues

const AuthForm = () => {
  const navigate = useNavigate()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  const toggleVariant = useCallback(
    () => setVariant((state: Variant) => (state === 'LOGIN' ? 'REGISTER' : 'LOGIN')),
    [setVariant]
  )

  const handleLogin = (action: OtherLoginAction) => {
    switch (action) {
      case 'scan': {
        open()
        break
      }
      case 'visitor': {
        setIsLoading(true)

        visitorLogin()
        .then((response) => {
          const { data } = response
          const { code, cookie } = data
          console.log(data)
          
          switch (code) {
            case 400: {
              toast.error(`登录失败，错误码:${data.code}`)
              break
            }
            case 200: {
              toast.success('登录成功')
              document.cookie = cookie
              navigate('/', { replace: true })
              break
            }
          }
        })
        .finally(() => setIsLoading(false))
      }
    }
  }

  const {
    getValues,
    register,
    handleSubmit,
    formState: {
      errors
    },
  } = useForm<Form>()

  const sendCaptcha = debounce(() => {
    const phone = getValues('phone')
    getCaptcha(phone).then(({ data: isSend }) => {
      if(isSend) {
        toast('验证码已发送')
      }
    })
  }, 1000)

  const onSubmit: SubmitHandler<Form> = (data) => {
    setIsLoading(true)

    const { phone, captcha, password, nickname } = data
    //登录
    if(variant === 'LOGIN') {
      //检查验证码
      verifyCaptcha(phone, captcha)
      .then((response) => {
        const verified = response.data
        if(verified) {
          return phoneCaptchaLogin(phone, password)
        }

        toast.error('验证码错误')
        return Promise.reject(response)
      })
      .then(({ data }) => {
        console.log('Login',data)
        document.cookie = data.cookie
        navigate('/', { replace: true })
      })
      .finally(() => setIsLoading(false))
    }else {
      //注册
    }
  }

  return (
    <Fragment>
      {isLoading && <Loading />}
      <QRCodeModal isOpen={isOpen} onClose={close} />
      <div className="mt-8 mx-auto w-3/4 min-w-[400px] max-w-[600px]">
        <div
          className="
          border p-8 h-[450px]
          rounded-md flex flex-col justify-evenly
        "
        >
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
            {variant === 'REGISTER' && (
              <Input
                name="nickname"
                label="昵称"
                required
                errors={errors}
                register={register}
              />
            )}
            <Input
              name="phone"
              type="number"
              label="手机号"
              required
              errors={errors}
              register={register}
            />
            {variant === 'REGISTER' && (
              <Input
                name="password"
                type="password"
                label="密码"
                required
                errors={errors}
                register={register}
              />
            )}
            <div className="flex justify-between items-end">
              <Input
                name="captcha"
                type="number"
                label="验证码"
                required
                errors={errors}
                register={register}
              />
              <Button
                fontSize={13}
                onClick={sendCaptcha}
              >
                获取验证码
              </Button>
            </div>
            <div className="flex flex-col gap-y-2">
              <Button
                type="submit"
              >
                {variant === 'REGISTER' ? '注册' : '登录'}
              </Button>
              {variant === 'LOGIN' && (
                <Fragment>
                  <Button
                    className="hidden lg:inline-block"
                    onClick={() => handleLogin('scan')}
                  >
                    扫码登录
                  </Button>
                  <Button
                    onClick={() => handleLogin('visitor')}
                  >
                    游客登录
                  </Button>
                </Fragment>
              )}
            </div>
          </form>
          <div>
            <p className="text-xs text-center font-light">
              如果{variant === 'REGISTER' ? '已经有' : '没有创建'}账号,请
              <span
                className="
                cursor-pointer
                font-normal 
                underline underline-offset-2 
                text-sky-600
              "
                onClick={toggleVariant}
              >
                {variant === 'REGISTER' ? '登录' : '注册'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AuthForm
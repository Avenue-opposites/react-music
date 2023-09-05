import { Icon } from '@iconify-icon/react'
import Layout from '~/layout/Layout'
import AuthForm from '~/components/Auth/AuthForm'

const Login = () => {

  return (
    <Layout>
      <h1 className="text-center mt-16">
        <Icon
          className="text-[100px] animate-spin-slow "
          icon="logos:react"
        />
        <p className="mt-4 text-2xl font-bold">欢迎访问React Music!</p>
      </h1>
      <AuthForm />
    </Layout>
  )
}

export default Login
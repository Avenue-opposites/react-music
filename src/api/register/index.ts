import api from '..'

export async function register(
  phone: string,
  captcha: string,
  password: string,
  nickname: string
) {
  return api.post('/register/cellphone', {
    phone,
    captcha,
    password,
    nickname
  })
}
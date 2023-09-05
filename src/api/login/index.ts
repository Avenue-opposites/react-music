import api from '..'

export async function visitorLogin() {
  return api.get('/register/anonimous')
}

export async function phoneCaptchaLogin(phone: string, captcha: string) {
  return api.get(`/login/cellphone?phone=${phone}&captcha=${captcha}`)
}

export async function getCaptcha(phone: string) {
  return api.get(`/captcha/sent?phone=${phone}`)
}

export async function verifyCaptcha(phone: string, captcha: string) {
  return api.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`)  
}

export async function getLoginStatus() {
  return api.get('login/status')
}

export async function logout() {
  return api.get('/logout')
}
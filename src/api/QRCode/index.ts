import api from '..'

export async function getQRCodeKey() {
 const timestamp = Date.now()
 return api.get(`/login/qr/key?timestamp=${timestamp}`)
}

export async function getQRCode(key: string, qrimg: boolean = true) {
  const timestamp = Date.now()
  return api.get(`/login/qr/create?key=${key}&timestamp=${timestamp}${qrimg ? '&qrimg=true' : ''}`)
}

export async function getQRCodeStatus(key: string) {
  const timestamp = Date.now()
  return api.get(`/login/qr/check?timestamp=${timestamp}&key=${key}`)
}
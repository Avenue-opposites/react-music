import { Banner } from '~/types/banner'
import api from '..'

export async function getBanner(type: Banner = Banner.PC) {
  return api.get(`/banner?type=${type}`)  
}
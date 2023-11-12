import axios from 'axios'
import { pinyinUtil } from 'ts-pinyin-lxc'
import { pinyin_dict_withtone } from'ts-pinyin-lxc/dict'


axios.defaults.withCredentials = true
pinyinUtil.addDict(pinyin_dict_withtone)


export const $version = '2.0'
export const $axios = axios
export const $pinyinUtil = pinyinUtil


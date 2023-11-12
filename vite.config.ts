import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        VitePWA({
            manifest: {
                "name": "Go 网址导航",
                "short_name": "Go",
                "description": "包含了学校常用网址的网址导航，并根据不同的网络环境提供不同的地址。",
                "icons": [
                    {
                        "src": "img/icons/android-chrome-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/android-chrome-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/android-chrome-maskable-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/android-chrome-maskable-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/apple-touch-icon.png",
                        "sizes": "180x180",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/apple-touch-icon-60x60.png",
                        "sizes": "60x60",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/apple-touch-icon-76x76.png",
                        "sizes": "76x76",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/apple-touch-icon-120x120.png",
                        "sizes": "120x120",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/apple-touch-icon-152x152.png",
                        "sizes": "152x152",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/apple-touch-icon-180x180.png",
                        "sizes": "180x180",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/favicon-16x16.png",
                        "sizes": "16x16",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/favicon-32x32.png",
                        "sizes": "32x32",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/msapplication-icon-144x144.png",
                        "sizes": "144x144",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/mstile-150x150.png",
                        "sizes": "270x270",
                        "type": "image/png"
                    },
                    {
                        "src": "img/icons/safari-pinned-tab.svg",
                        "sizes": "16x16",
                        "type": "text/xml"
                    }
                ],
                "start_url": ".",
                "display": "fullscreen",
                "theme_color": "#3fac90",
                "background_color": "#3fac90"
            },
            strategies: 'injectManifest',
            injectRegister: false,
            srcDir: 'src',
            filename: 'serviceWorker.ts',
            injectManifest: {
                additionalManifestEntries: [
                    {
                        url: 'website-list.json',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/acm.neusoft.edu.cn.ico',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/cps.front.neucoding.com.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/developer.mozilla.org.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/examcas.neumooc.com.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/gitee.com.ico',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/github.com.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/hw.neusoft.edu.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/itestcloud.unipus.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/jst.neusoft.edu.cn.ico',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/mail.dnui.edu.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/newjw.neusoft.edu.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/one.neuedu.com.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/pigai.org.ico',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/stu.neusoft.edu.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/study.neutech.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/study1230.neuedu.com.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/vpn.neuedu.com.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/webvpn.neusoft.edu.cn.png',
                        revision: 'v1'
                    },
                    {
                        url: 'WebsiteIcon/www.icourse163.org.png',
                        revision: 'v1'
                    }

                ]
            },

            devOptions: {
                enabled: false,
                type: 'module'
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})

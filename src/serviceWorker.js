import {precacheAndRoute} from 'workbox-precaching';
// import {getCacheKeyForURL} from 'workbox-routing';

console.log('[Service Worker] 开始缓存资源...')
precacheAndRoute(self.__WB_MANIFEST)
console.log('[Service Worker] 资源缓存结束')


function precacheBingImg(resolve) {

    console.log('缓存必应每日一图')
    caches.open('bingImg').then((cache)=>{
        //构造请求
        const date = new Date()
        const signUrl = 'https://api.isoyu.com/bing_images.php?date='+date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()
        const signRequest = new Request(signUrl, {mode:'cors',credentials:'omit'})

        //访问资源并放入缓存
        fetch(signRequest).then((fetchResponse)=>{
            cache.put(signRequest, fetchResponse.clone()).then(() => {
                console.log('[Service Worker] 成功缓存必应每日一图')
                resolve()
            })
        }).catch(()=>{console.error('[fetch] 访问图片失败')})
    }).catch(()=>{console.error('[cache] 打开bingImg失败')})

}
self.addEventListener('install', (e)=>{
    e.waitUntil(new Promise(precacheBingImg))
})

self.addEventListener('message',  even => {
    if (even.data === 'skipWaiting') {
        self.skipWaiting().then(() => {})
    }
})

// precacheAndRoute后再监听fetch事件，只有没被precacheAndRoute的资源才会触发手动监听的事件
self.addEventListener('fetch', (even) => {
    even.respondWith((async ()=>{
        if (even.request.url.includes('api.isoyu.com/bing_images.php')) {

            const cache = await caches.open('bingImg')

            const date = new Date()
            const signUrl = even.request.url+'?date='+date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()
            const signRequest = new Request(signUrl, {mode:'cors',credentials:'omit'})

            const cachedResponse = await cache.match(signRequest.url)

            if (cachedResponse) { //找到缓存
                return cachedResponse
            } else { //找不到
                let cacheKeys = await cache.keys()
                try {
                    // const fetchResponse = await fetch(even.request, {mode:'cors',credentials:'omit'}) //联网获取资源

                    //请求新的内容并放入缓存
                    const fetchResponse = await fetch(signRequest) //联网获取资源
                    cache.put(signRequest, fetchResponse.clone()).then(() => {
                        console.log('[Service Worker] 成功添加新缓存文件: '+signRequest.url)

                        //成功放入新图片后: 删除旧缓存图片
                        cacheKeys.forEach((key)=>{cache.delete(key)})
                    })


                    return fetchResponse
                } catch (error) {
                    console.error('[Service Worker] '+signRequest.url+' 加载失败')
                    console.error(error)

                    //判断是否有旧缓存: 有旧返回旧的图片，没有就返回错误
                    if (cacheKeys.length !== 0) { //有旧图片，返回
                        console.log('即将返回旧照片')
                        return cache.match(cacheKeys[0])
                    } else { //没有旧图片: 返回错误
                        console.log('没有旧照片，返回错误')
                        return new Response("Network error happened", { //即使网络错误也要返回点什么
                            status: 408,
                            headers: { "Content-Type": "text/plain" },
                        });
                    }

                }
            }

        } else {
            return fetch(even.request)
        }
    })())
})



// console.log('testSW')
// console.log(getCacheKeyForURL('index.html')) //http://localhost:8080/index.html?__WB_REVISION__=70301711aeb0883340046e3d91dbfae7






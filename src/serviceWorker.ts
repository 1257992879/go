import { precacheAndRoute } from 'workbox-precaching';


declare let self: Window & ServiceWorkerGlobalScope


const siteUrl = new URL(self.location.toString())
const bingImgUrl = 'https://api.lxc2.com:8/bingImg'
const bingImgUrlKeyword = 'api.lxc2.com:8/bingImg'
const bingImgCacheName = 'bingImg-' + siteUrl.origin + siteUrl.pathname.substring(0,siteUrl.pathname.lastIndexOf('/')+1)

function precacheBingImg(resolve: (value?: unknown) => void) {

    console.log('sw安装时 缓存必应每日一图')
    caches.open(bingImgCacheName).then((cache)=>{
        //构造请求
        const date = new Date()
        // const signUrl = 'https://api.isoyu.com/bing_images.php?date='+date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()
        const signUrl = bingImgUrl + '?date='+date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()
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

//传入Cache对象和URL对象     返回:  找到返回: Promise<Response>      找不到返回: Promise<undefined>
function findCache(cache: Cache, urlObj: URL): Promise<Response|undefined> {
    return new Promise((resolve) => {
        cache.keys()
            .then((keys)=>{ //得到所有缓存key
                let cacheFound = false

                for (let i = 0; i < keys.length; i++) { //遍历所有key看看能不能找到匹配的缓存Request
                    const cacheUrl = new URL(keys[i].url)
                    if ((cacheUrl.origin===urlObj.origin) && //匹配上的规则: 1.请求的服务器、端口一样  2.访问的path一样  3.date参数一样
                        (cacheUrl.pathname===urlObj.pathname) &&
                        (cacheUrl.searchParams.get('date')===urlObj.searchParams.get('date'))
                    ) {
                        cacheFound = true;
                        cache.match(keys[i])
                            .then((req)=>{resolve(req as Response)}) //找到缓存: 返回cache.match()返回的Promise<Response>
                            .catch(()=>{console.error('匹配上了但是cache.match()无法返回Response');resolve(undefined)})
                    }
                }

                if (!cacheFound) {resolve(undefined)} //找不到缓存: 返回undefined
            })
            .catch(()=>{resolve(undefined)})
    })
}


// 定义常量及函数结束，sw逻辑开始


console.log('[Service Worker] 开始缓存资源...')
precacheAndRoute(self.__WB_MANIFEST)
console.log('[Service Worker] 资源缓存结束')


self.addEventListener('install', (e: ExtendableEvent)=>{
    e.waitUntil(new Promise(precacheBingImg))
})

self.addEventListener('message',  even => {
    if (even.data === 'skipWaiting') {
        self.skipWaiting().then(() => {})
    }
})

// precacheAndRoute后再监听fetch事件，只有没被precacheAndRoute的资源才会触发手动监听的事件
self.addEventListener('fetch', (even: FetchEvent) => {
    even.respondWith((async (): Promise<Response>=>{
        if (even.request.url.includes(bingImgUrlKeyword)) {
            console.log('fetching bingImg: '+even.request.url)

            const cache = await caches.open(bingImgCacheName)

            // 构造带有今天的日期标记的url对象
            const date = new Date()
            const dateStr = date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()
            const urlObj = new URL(even.request.url)
            urlObj.searchParams.set('date', dateStr) //给url添加日期参数

            // const signRequest = new Request(signUrl, {mode:'cors',credentials:'omit'})
            // const cachedResponse = await cache.match(signRequest.url);

            const cachedResponse = await findCache(cache, urlObj)


            if (cachedResponse) { //找到缓存
                console.log('找到缓存: 返回照片缓存')
                return cachedResponse
            } else { //找不到
                //尝试返回以前的照片
                const cacheKeys = await cache.keys()
                const signRequest = new Request(urlObj.href, {mode:'cors',credentials:'omit'})

                //判断是否有旧缓存: 有旧返回旧的图片，没有就返回错误
                if (cacheKeys.length > 0) { //有旧图片，返回
                    console.log('返回旧照片,缓存新照片')

                    //更新缓存
                    fetch(signRequest).then((resp)=>{
                        cache.put(signRequest, resp.clone()).then(() => {
                            console.log('[Service Worker] 成功缓存文件: '+signRequest.url)
                            //成功放入新图片后: 删除旧缓存图片
                            cacheKeys.forEach((key)=>{cache.delete(key)})
                            //触发事件，要求刷新背景图
                            self.clients.matchAll().then((clients: readonly Client[]) => {
                                // console.log(clients)
                                clients.forEach((client: Client) => {
                                    // console.log(client);
                                    // if (client.url.includes('/a.html'))
                                    // client.postMessage('hello world' + client.id);
                                    client.postMessage('RefreshBackgroundImage')
                                });
                            })
                        }).catch((error)=>{console.error('更新背景图失败: 文件无法添加到缓存: ');console.error(error)})
                    }).catch((error)=>{console.error('更新背景图失败: 网络错误: ');console.error(error)})


                    return await cache.match(cacheKeys[0]) as Response
                } else { //没有旧图片: 发起网络请求获取新照片
                    console.log('没有旧照片，发起网络请求获取新照片')


                    //尝试发起网路请求获取新照片，如果获取失败则返回错误
                    try {
                        // const fetchResponse = await fetch(even.request, {mode:'cors',credentials:'omit'}) //联网获取资源

                        //请求新的内容并放入缓存
                        const fetchResponse = await fetch(signRequest) //联网获取资源
                        cache.put(signRequest, fetchResponse.clone()).then(() => {
                            console.log('[Service Worker] 成功缓存文件: '+signRequest.url)

                            //成功放入新图片后: 删除其他缓存图片
                            cacheKeys.forEach((key)=>{cache.delete(key)})
                        })


                        return fetchResponse
                    } catch (error) {
                        console.error('[Service Worker] '+signRequest.url+' 加载失败')
                        console.error(error)

                        return new Response("Network error happened", {
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



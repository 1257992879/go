/* eslint-disable no-console */
import { register } from 'register-service-worker'
import { Notification } from 'element-ui'


if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    window.location.reload() //使用skipWaiting让新的sw接管了页面后会调用controllerchange事件，然后就刷新页面
  });
  register(`${process.env.BASE_URL}serviceWorker.js`, {
    ready () {
      console.log('App is being served from cache by a service worker.')
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
      Notification({
        title: 'ServiceWorker',
        message: 'ServiceWorker 已经为离线访问做好准备',
        type: 'success',
        position: 'bottom-left'
      })
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')

      let notification
      document.addEventListener('swConfirmUpdate', ()=>{
        registration.waiting.postMessage('skipWaiting')
      })
      document.addEventListener('swCancelUpdate', ()=>{
        notification.close()
      })

      const swUpdateMessage = '' +
          '<spam>\n' +
          '    <span>新版本已安装，是否刷新网页</span><br>\n' +
          '    <button ' +
                  'class="el-button el-button--mini"' +
                  'onclick="var event = new Event(\'swCancelUpdate\');document.dispatchEvent(event)"' +
                  '>取消</button>\n' +
          '    <button ' +
                  'class="el-button el-button--primary el-button--mini" ' +
                  'style="margin-left: 3px" ' +
                  'onclick="var event = new Event(\'swConfirmUpdate\');document.dispatchEvent(event)"' +
                  '>更新</button>\n' +
          '</span>'
      console.log('ready')
      notification = Notification({
        title: 'ServiceWorker',
        dangerouslyUseHTMLString: true,
        message: swUpdateMessage,
        type: 'success'
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

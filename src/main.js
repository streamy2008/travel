import { registerSW } from 'virtual:pwa-register';

console.log('Travel PWA 启动成功');

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('有新版本可用，是否刷新？')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('离线缓存准备就绪，应用可离线使用');
  }
});

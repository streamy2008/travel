import { registerSW } from 'virtual:pwa-register';

console.log('Travel PWA 启动成功');

const pwaStatus = document.getElementById('pwa-status');
function updatePwaStatus(text) {
  if (!pwaStatus) return;
  pwaStatus.textContent = `PWA 状态：${text}`;
}

function checkInstalledState() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) {
    updatePwaStatus('已安装');
  } else {
    updatePwaStatus('未安装');
  }
}

checkInstalledState();

let deferredPrompt = null;
const installBanner = document.getElementById('pwa-install-banner');
const installButton = document.getElementById('btn-install-pwa');
const dismissButton = document.getElementById('btn-dismiss-pwa');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installBanner) {
    installBanner.style.display = 'flex';
  }
});

window.addEventListener('appinstalled', () => {
  console.log('PWA 已安装');
  if (installBanner) installBanner.style.display = 'none';
  deferredPrompt = null;
  updatePwaStatus('已安装');
});

window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
  if (e.matches) {
    updatePwaStatus('已安装');
  } else {
    updatePwaStatus('未安装');
  }
});

if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installButton.disabled = true;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('用户接受安装');
    } else {
      console.log('用户拒绝安装');
    }
    deferredPrompt = null;
    if (installBanner) installBanner.style.display = 'none';
    installButton.disabled = false;
  });
}

if (dismissButton) {
  dismissButton.addEventListener('click', () => {
    if (installBanner) installBanner.style.display = 'none';
  });
}

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

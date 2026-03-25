import { registerSW } from 'virtual:pwa-register';

console.log('Travel PWA 启动成功');

let pwaStatus = null;
let pwaInstallText = null;
let installBanner = null;
let installButton = null;
let dismissButton = null;

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

function hideInstallBanner() {
  if (installBanner) installBanner.style.display = 'none';
}

function showInstallBanner(msg) {
  if (!installBanner || !pwaInstallText) return;
  pwaInstallText.textContent = msg;
  installBanner.style.display = 'flex';
}

let deferredPrompt = null;

window.addEventListener('DOMContentLoaded', () => {
  pwaStatus = document.getElementById('pwa-status');
  pwaInstallText = document.getElementById('pwa-install-text');
  installBanner = document.getElementById('pwa-install-banner');
  installButton = document.getElementById('btn-install-pwa');
  dismissButton = document.getElementById('btn-dismiss-pwa');

  checkInstalledState();

  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) {
        showInstallBanner('当前不可直接弹出安装，请使用浏览器菜单添加至主屏。');
        return;
      }
      installButton.disabled = true;
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('用户接受安装');
        updatePwaStatus('已安装');
      } else {
        console.log('用户拒绝安装');
      }
      deferredPrompt = null;
      hideInstallBanner();
      installButton.disabled = false;
    });
  }

  if (dismissButton) {
    dismissButton.addEventListener('click', hideInstallBanner);
  }
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  showInstallBanner('发现可安装版本，点击“安装”即可添加主屏。');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA 已安装');
  hideInstallBanner();
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

// キャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
    '/poster-keisuke.github.io/',
];

// インストール処理
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response ? response : fetch(event.request);
            })
    );
});
// Firebase利用準備
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');
firebase.initializeApp({
    'messagingSenderId': '379502638253'
});
const messaging = firebase.messaging();
 
// フォアグラウンドでのプッシュ通知受信
messaging.onMessage(function(payload) {
    var notificationTitle = payload.data.title; // タイトル
    var notificationOptions = {
      body: payload.data.body, // 本文
      icon: '/pwa_512.png', // アイコン
      click_action: 'https://xxxx.sample.com/' // 飛び先URL
    };
 
    if (!("Notification" in window)) {
        // ブラウザが通知機能に対応しているかを判定
    } else if (Notification.permission === "granted") {
        // 通知許可されていたら通知する
        var notification = new Notification(notificationTitle,notificationOptions);
    }
});
 
// バックグラウンドでのプッシュ通知受信
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = payload.notification.title; // タイトル
    var notificationOptions = {
            body: payload.notification.body, // 本文
            icon: payload.notification.icon, // アイコン
    };
 
    return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
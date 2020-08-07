// PWA�Ńv�b�V���ʒm���������Ă݂�i�Q�jST
// VERSION:�L���b�V���ԍ�
const VERSION = "1";
const ORIGIN = location.protocol + '//' + location.hostname;
 
const STATIC_CACHE_KEY = 'static-' + VERSION;
// �L���b�V��������t�@�C�����w��
const STATIC_FILES = [
    ORIGIN + '/',
    ORIGIN + '/images/icon-192.png',
    ORIGIN + '/images/icon-256.png',
    ORIGIN + '/js/firebase-messaging-sw.js',
];
const CACHE_KEYS = [
    STATIC_CACHE_KEY
];

// �L���b�V���̍쐬�E���p�E�폜
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_KEY).then(cache => {
            return Promise.all(
                STATIC_FILES.map(url => {
                    return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
                    return cache.put(url, response);
                    });
                })
            );
        })
    );
});
 
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheName) => {
                // STATIC_CACHE_KEY�ł͂Ȃ��L���b�V����T��
                return cacheName !== STATIC_CACHE_KEY;
            });
            }).then((cachesToDelete) => {
            return Promise.all(cachesToDelete.map((cacheName) => {
                // ����Ȃ��L���b�V�����폜����
                return caches.delete(cacheName);
            }));
        })
    );
});
 
self.addEventListener('fetch', event => {
    // POST�̏ꍇ�̓L���b�V�����g�p���Ȃ�
    if ('POST' === event.request.method) {
        return;
    }
 
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // �L���b�V�����ɊY�����X�|���X������΁A�����Ԃ�
            if (response) {
                return response;
            }
 
          // �d�v�F���N�G�X�g�� clone ����B���N�G�X�g�� Stream �Ȃ̂�
          // ��x���������ł��Ȃ��B�����ł̓L���b�V���p�Afetch �p��2��
          // �K�v�Ȃ̂ŁA���N�G�X�g�� clone ���Ȃ��Ƃ����Ȃ�
            let fetchRequest = event.request.clone();
 
            return fetch(fetchRequest)
            .then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    // �L���b�V������K�v�̂Ȃ��^�C�v�̃��X�|���X�Ȃ炻�̂܂ܕԂ�
                    return response;
                }
 
                // �d�v�F���X�|���X�� clone ����B���X�|���X�� Stream ��
                // �u���E�U�p�ƃL���b�V���p��2��K�v�B�Ȃ̂� clone ����
                // 2�� Stream ������悤�ɂ���
                let responseToCache = response.clone();
 
                caches.open(STATIC_CACHE_KEY)
                .then((cache) => {
                    cache.put(event.request, responseToCache);
                });
 
                return response;
            });
        })
    );
});
// PWA�Ńv�b�V���ʒm���������Ă݂�i�Q�jEN
// PWA�Ńv�b�V���ʒm���������Ă݂�i�S�jST
// Firebase���p����
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');
firebase.initializeApp({
    'messagingSenderId': '379502638253'
});
const messaging = firebase.messaging();
 
// �t�H�A�O���E���h�ł̃v�b�V���ʒm��M
messaging.onMessage(function(payload) {
    var notificationTitle = payload.data.title; // �^�C�g��
    var notificationOptions = {
      body: payload.data.body, // �{��
      icon: '/pwa_512.png', // �A�C�R��
      click_action: 'https://xxxx.sample.com/' // ��ѐ�URL
    };
 
    if (!("Notification" in window)) {
        // �u���E�U���ʒm�@�\�ɑΉ����Ă��邩�𔻒�
    } else if (Notification.permission === "granted") {
        // �ʒm������Ă�����ʒm����
        var notification = new Notification(notificationTitle,notificationOptions);
    }
});
 
// �o�b�N�O���E���h�ł̃v�b�V���ʒm��M
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = payload.notification.title; // �^�C�g��
    var notificationOptions = {
            body: payload.notification.body, // �{��
            icon: payload.notification.icon, // �A�C�R��
    };
 
    return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// PWA�Ńv�b�V���ʒm���������Ă݂�i�S�jEN

//PWA�Ńv�b�V���ʒm���������Ă݂�i�R�j���
// Firebase�ݒ�
var firebaseConfig = {
  apiKey: "AIzaSyCsOmhrGdsEa0cb7R5bikmVkqhShVIRrqQ",
  authDomain: "test-6c79d.firebaseapp.com",
  databaseURL: "https://test-6c79d.firebaseio.com",
  projectId: "test-6c79d",
  storageBucket: "test-6c79d.appspot.com",
  messagingSenderId: "379502638253",
  appId: "1:379502638253:web:e9abcd9a3dc592cfe94224",
  measurementId: "G-6X63XLVKXE"
};
firebase.initializeApp(firebaseConfig);
 
// FCM�g�p����
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BAs6YNtBsRnqf1vj1THto3nthejprpfWsEeHt7x6COEhgVdOQEgGG0avuLmdbWgSw3U_ahujAeb-gm7xNhFkroI');// VAPID��ݒ�
 
// Firestore�g�p����
var db = firebase.firestore();
var usersRef = db.collection("users");

// �w�Ǌm�F���s��
checkSubscription();

//�g�[�N����\������
displayToken();
 
// �w�Ǌm�F����
function checkSubscription() {
    //�ʒm�̏��F���m�F
    messaging.requestPermission().then(function() {
        //�g�[�N�����m�F
        messaging.getToken().then(function(token) {
            //�g�[�N�����s
            if (token) {
                //�g�[�N����DB�ɓ����Ă��邩�m�F
                usersRef.where('token', '==', token).get().then(function(oldLog){
                    if(oldLog.empty){
                    //�����Ă��Ȃ���΍w�ǃ{�^���\��
                        console.log('�g�[�N���͓o�^����Ă��܂���B');
                        $('#notification p.caution').text('�ʒm���w�ǂ��Ă��܂���B');
                        ShowEntryButton();
                    } else {
                    //�����Ă���΍w�Ǐ󋵊m�F
                        console.log('�g�[�N���͂��łɓo�^����Ă��܂��B');
                        oldLog.forEach(function(doc){
                            var data = doc.data();
                            if(data.subscribe == true){
                            //�w�ǂ��Ă���i����~�{�^���\���j
                                $('#notification p.caution').text('�ʒm���w�ǂ��Ă��܂��B');
                                ShowRemoveButton();
                            } else {
                            //�w�ǂ��Ă��Ȃ��i���J�n�{�^���\���j
                                $('#notification p.caution').text('�w�ǂ��������܂����B');
                                ShowEntryButton();
                            }
                        });
                    }
                });
            } else {
                    console.log('�ʒm�̏��F�������܂���ł����B');
                    $('#notification p.caution').text('�w�ǂ��J�n�ł��܂���ł����B');
                    ShowEntryButton();
            }
        }).catch(function(err) {
                console.log('�g�[�N�����擾�ł��܂���ł����B', err);
                $('#notification p.caution').text('�w�ǂ��J�n�ł��܂���ł����B');
                ShowEntryButton();
        });
    }).catch(function(err) {
        //�v�b�V���ʒm���Ή�
            console.log('�ʒm�̏��F�������܂���ł����B', err);
            $('#notification p.caution').text('�v�b�V���ʒm��������Ă��܂���B�u���E�U�̐ݒ���m�F���Ă��������B');
            ShowEntryButton();
    });
}
 
// �w�Ǐ���
function getSubscription() {
    //�ʒm�̏��F���m�F
  messaging.requestPermission().then(function() {
        //�g�[�N�����m�F
        messaging.getToken().then(function(token) {
            //�g�[�N�����s
            if (token) {
                //�g�[�N����DB�ɓ����Ă��邩�m�F
                usersRef.where('token', '==', token).get().then(function(oldLog){
                    if(oldLog.empty){
                    //�g�[�N���o�^���Ȃ���΃g�[�N���o�^�E�w�ǐݒ�
                        usersRef.add({
                            token: token,
                            subscribe: true
                        });
                        console.log('�g�[�N���V�K�o�^���܂����B');
                    } else {
                    //�g�[�N���o�^������΍w�ǂɐݒ�ύX
                        oldLog.forEach(function(doc){
                            console.log('�g�[�N���͂��łɓo�^����Ă��܂��B');
                            usersRef.doc(doc.id).update({
                                subscribe: true
                            })
                        });
                    }
                    //�w�ǉ����{�^���\��
                    ShowRemoveButton();
                });
                //�w�Ǐ󋵕\���X�V
                $('#notification p.caution').text('�ʒm���w�ǂ��Ă��܂��B');
            } else {
                console.log('�ʒm�̏��F�������܂���ł����B');
                $('#notification p.caution').text('�w�ǂ��J�n�ł��܂���ł����B');
                ShowEntryButton();
            }
        }).catch(function(err) {
            console.log('�g�[�N�����擾�ł��܂���ł����B', err);
            $('#notification p.caution').text('�w�ǂ��J�n�ł��܂���ł����B');
            ShowEntryButton();
        });
  }).catch(function(err) {
        console.log('�ʒm�̏��F�������܂���ł����B', err);
        $('#notification p.caution').text('�v�b�V���ʒm��������Ă��܂���B�u���E�U�̐ݒ���m�F���Ă��������B');
        ShowEntryButton();
    });
}
 
// �w�ǉ�������
function removeSubscription() {
    //�ʒm�̏��F���m�F
    messaging.requestPermission().then(function() {
        //�g�[�N�����m�F
        messaging.getToken().then(function(token) {
            //�g�[�N�����s
            if (token) {
                //�g�[�N����DB�ɓ����Ă��邩�m�F
                usersRef.where('token', '==', token).get().then(function(oldLog){
                    if(oldLog.empty){
                    //�g�[�N���o�^���Ȃ���΍w�ǃ{�^���\��
                        console.log('�g�[�N���͓o�^����Ă��܂���B');
                        ShowEntryButton();
                    } else {
                    //�g�[�N���o�^������΍w�ǉ������s��
                        oldLog.forEach(function(doc){
                            usersRef.doc(doc.id).update({
                                subscribe: false
                            })
                            .then(function() {
                                console.log("�w�ǂ��������܂����B");
                                ShowEntryButton();
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                            });
                        });
                    }
                });
                //�w�Ǐ󋵕\���X�V
                $('#notification p.caution').text('�w�ǂ��������܂����B');
            } else {
                console.log('�g�[�N�����擾�ł��܂���ł����B');
                $('#notification p.caution').text('�w�ǂ��J�n�ł��܂���ł����B');
            }
        }).catch(function(err) {
            console.log('�g�[�N�����擾�ł��܂���ł����B', err);
            $('#notification p.caution').text('�w�ǂ��J�n�ł��܂���ł����B');
        });
    }).catch(function (err) {
        console.log('�ʒm�̏��F�������܂���ł����B', err);
        $('#notification p.caution').text('�v�b�V���ʒm��������Ă��܂���B�u���E�U�̐ݒ���m�F���Ă��������B');
        ShowEntryButton();
    });
}
 
//�@�g�[�N���\��
function displayToken() {
  messaging.getToken().then(token => {
        if (token) {
            console.log(token);
        } else {
            console.log('�g�[�N�����擾�ł��܂���ł����B');
        }
  }).catch(function (err) {
    console.log('�g�[�N���̎擾���ɃG���[���������܂����B', err);
  });
}
 
 
//�w�ǃ{�^���\��
function ShowEntryButton() {
    $('#EntryButton').show();
    $('#RemoveButton').hide();
}
 
//�w�ǎ���{�^���\��
function ShowRemoveButton() {
    $('#EntryButton').hide();
    $('#RemoveButton').show();
}


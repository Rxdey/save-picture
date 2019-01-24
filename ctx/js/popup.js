$(function() {
  chrome.storage.sync.get({ rxToken: null }, function(items) {
    console.log(items.rxToken)
    if (!items.rxToken) {
      $('.list-content').hide();
      $('.login-content').show();
    }
  });
  $('#find').click(function() {
    chrome.tabs.create({ url: 'http://localhost:3000/findpassword' });
  });
  $('#reg').click(function() {
    chrome.tabs.create({ url: 'http://localhost:3000/registered' });
  });
  $('#logout').click(function(){
    chrome.storage.sync.set({ rxToken: null }, function() {
      $('.list-content').hide();
      $('.login-content').show();
      console.log('已退出');
    });
  })
  $('.rx-btn-login').click(function() {
    const username = $('#username').val();
    const password = $('#password').val();
    if (!username || !password) {
      alert('账号密码不能为空');
      return false;
    }
    $.post('http://localhost:3000/api/login',{username,password},function(res){
      alert(res.message)
      if(res.state === 1){
        $('.list-content').show();
        $('.login-content').hide();
        chrome.storage.sync.set({ rxToken: res.data.token }, function() {
          console.log('保存成功！');
        });
      }
    })
  });
});

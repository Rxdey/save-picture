chrome.contextMenus.create({
  title: '收藏',
  contexts: ['image'], // 只有当选中文字时才会出现此右键菜单
  onclick: function(params) {
    const imgSrc = params.srcUrl;
    const from_path = params.pageUrl;
    // const create_date = new Date().getTime;
    chrome.storage.local.get('rxToken', function(items) {
      console.log(items);
      if (!items.rxToken) {
        alert('收藏失败，请打开插件设置登录您的账号');
        return false;
      }
      $.ajax({
        type: 'post',
        headers: {
          Authorization: 'Bearer ' + items.rxToken
        },
        url: 'http://localhost:3000/api/saveImage',
        data: { imgSrc, from_path },
        success: function(res) {
          if(!res.state&&res.code ==='88888' ){
            chrome.storage.local.set({ rxToken: null },function(){
              window.localStorage.removeItem('rxToken');
            });
            alert('收藏失败，请打开插件设置登录您的账号');
            return
          }
        },
        error:function(err){
          alert('收藏失败')
        }
      });
    });
  }
});

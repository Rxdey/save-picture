<template>
  <div class="container">
    <p v-show="!list.length">
      暂无收藏
    </p>
    <div class="user-image">
      <div class="image-block" v-for="(group,index) in imageList" :key="index">
        <div class="title">
          <p>{{group[0].from_path | hideHttp}}</p>
          <p class="save" @click="resave(getName(group[0].from_path))">折叠</p>
        </div>
        <ul class="image-list" :ref="getName(group[0].from_path)">
          <li class="image-list-child" v-for="(item, index) in group" :key="item.id" @click="handleImageClick(group,item)">
            <div class="date">{{item.create_date | dateFormat}} <p class="remove" @click.stop="handleDelete(item,index)">删</p>
            </div>
            <div class="img" v-lazy:background-image="item.imgSrc"></div>
          </li>
        </ul>
      </div>
    </div>
    <transition name="scale">
      <div class="img-preview" v-show="isPreview" @click="handleClose">
        <div class="preview" @click.stop="previewClick">
          <div class="close" @click="handleClose">close</div>
          <img :src="showImage" alt="">
          <!-- <div class="tool">
            <div class="prve" @click="handlePrve" v-show="isPrve">prve</div>
            <div class="next" @click="handleNext" v-show="isNext">next</div>
          </div> -->
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="isPreview"></div>
    </transition>

    <transition name="scale">
      <div class="login-content" v-show="showLogin">
        <div class="title">登录</div>
        <div class="rx-from-group">
          <input type="text" name="username" v-model="email" id="username" placeholder="用户名/邮箱">
        </div>
        <div class="rx-from-group">
          <input type="password" name="password" v-model="passwd" id="password" placeholder="密码">
        </div>
        <div class="rx-from-group">
          <button type="button" class="rx-btn rx-btn-login" @click="handleLogin">登录</button>
        </div>
        <!-- <div class="reg">
          <p id="find"></p>
          <p id="reg">注册</p>
        </div> -->
      </div>
    </transition>

    <transition name="fade">
      <div class="mask" v-show="showLogin"></div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import http from './server/index.js';
import { addClass, hasClass, removeClass, urlReg } from './server/util.js';
import def from './server/default.png'

Vue.use(VueLazyload, {
  error: def,
  loading: def
})
// const getPath = /.+[\.\/]([A-z0-9]+\.[A-z0-9]+)\/[^\/].+/;
export default {
  name: 'optpage',
  props: {
  },
  data () {
    return {
      activeTarget: 0,
      activeImage: 0,
      isPreview: false,
      showImage: null,
      isPrve: true,
      isNext: true,
      list: [],
      imageList: null,
      showLogin: false,
      email: '',
      passwd: ''
    }
  },
  computed: {
  },
  filters: {
    hideHttp (val) {
      return val.match(urlReg)[2];
    },
    dateFormat (date) {
      const temp = new Date(date);
      return `${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()} ${temp.getHours()}:${temp.getMinutes()}:${temp.getSeconds()}`
    }
  },
  mounted () {
    if (!this.showLogin) {
      this.getData();
    }
  },
  methods: {
    async handleLogin () {
      if (!this.email || !this.passwd) {
        alert('账号密码不能为空');
        return false;
      }
      const url = {
        url: 'http://saveimage.rxdey.xyz/api/login',
        method: 'post'
      }
      const res = await http(url, { username: this.email, password: this.passwd });
      alert(res.data.message);
      if (!res.data.state) {
        return;
      }
      localStorage.setItem('rxToken', res.data.data.token);
      window.location.reload();
      this.showLogin = false;
    },
    resave (target) {
      // console.log(this.$refs[target][0])
      if (hasClass(this.$refs[target][0], 'hide')) {
        removeClass(this.$refs[target][0], 'hide');
        return
      }
      addClass(this.$refs[target][0], 'hide')
    },
    getName (val) {
      return val.match(urlReg)[2];
    },
    previewClick () {
      return false
    },
    async handleDelete (item, index) {
      const url = {
        url: 'http://saveimage.rxdey.xyz/api/del',
        method: 'post'
      }
      const res = await http(url, { id: item.id });
      // alert(res.data.message);
      if (!res) return;
      this.imageList[this.activeTarget].splice(index, 1);
    },
    handlePrve () {
    },
    handleNext () {
    },
    handleClose () {
      this.isPreview = false;
      // this.showImage = null;
    },
    handleImageClick (group, item) {
      this.isPreview = true;
      this.activeTarget = this.imageList.indexOf(group);
      this.activeImage = group.indexOf(item);
      this.showImage = item.imgSrc;
    },
    grouping (list) {
      const arr = list.reduce((prve, next) => {
        let path = next.from_path.match(urlReg)[2];
        if (typeof prve[path] === 'undefined') {
          prve[path] = [];
        }

        prve[path].push(next);
        return prve
      }, {});
      const temp = [];
      Object.keys(arr).map(item => {
        temp.push(arr[item])
      })
      return temp
    },
    async getData () {
      const url = {
        url: 'http://saveimage.rxdey.xyz/api/allpic',
        method: 'post'
      }
      const res = await http(url);
      if (!res || res === '88888') {
        this.showLogin = true;
        return false;
      };
      this.list = res.data.data;
      this.$nextTick(() => {
        this.imageList = this.grouping(this.list);
      })
    }
  }
};
</script>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  list-style: none;
}
body,
html {
  background: #f1f1f1;
}
.nav {
  width: 100%;
  height: 60px;
  background: #333;
}
.container {
  width: 900px;
  margin: 15px auto;
  background: #fff;
  padding: 30px;
}
.user-image {
  /* padding: 30px; */
}
.image-block {
}
.image-block .title {
  width: 100%;
  background: #fff;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 15px;
  color: #999;
}
.save {
  cursor: pointer;
}
.image-list {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  padding: 15px 0 15px 0;
}
.image-list.hide {
  display: none;
}
.image-list-child {
  width: 20%;
  /* flex: 0 0 20%; */
  display: flex;
  flex-flow: row;
  overflow: hidden;
  align-items: center;
  height: 200px;
  justify-content: center;
  cursor: pointer;
  background: #000;
  position: relative;
  border-radius: 4px;
  flex-flow: column;
  border-radius: 8px;
  box-shadow: 0 0 16px 0 #999;
  margin-right: 30px;
  margin-bottom: 30px;
}
.image-list-child .img {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s transform;
  overflow: hidden;
}
.image-list-child:hover {
  background: #333;
}
.image-list-child:hover .img {
  transform: scale(1.5);
}
.date {
  width: 100%;
  padding: 10px;
  top: 0;
  left: 0;
  background: #fff;
  position: relative;
  z-index: 9;
  font-size: 12px;
  color: #333;
}
.remove {
  color: #f72e2e;
  position: absolute;
  right: 5px;
  top: 10px;
  text-decoration: underline;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
}
.img-preview {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  /* background: rgba(0, 0, 0, 0.8); */
  overflow: hidden;
}
.preview {
  z-index: 10000;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 16px #999;
  overflow: hidden;
  padding: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* max-width: 500px; */
  /* max-height: 500px; */
}
.preview img {
  /* max-width: 800px; */
  max-width: 100%;
  max-height: 800px;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  /* width: 30px; */
  text-align: center;
  color: #999;
  text-decoration: underline;
  padding: 30px;
  cursor: pointer;
}
.tool {
  position: absolute;
  bottom: 0;
  right: 0;
  color: #999;
  display: flex;
  flex-flow: row;
  padding: 30px;
  justify-content: space-between;
  width: 100%;
}
.tool .prve {
  text-decoration: underline;
  cursor: pointer;
}
.tool .next {
  text-decoration: underline;
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
  opacity: 1;
}
.fade-enter,
.fade-leave-to {
  transition: 0.3s;
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition: 0.3s;
  opacity: 1;
  transform: scale(1);
}
.scale-enter,
.scale-leave-to {
  transition: 0.3s;
  opacity: 0;
  transform: scale(0.5);
}
.login-content {
  background: #fff;
  border-radius: 4px;
  width: 400px;
  padding: 30px;
  position: fixed;
  z-index: 100000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-content .title {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
}

.reg {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.reg p {
  color: cadetblue;
  cursor: pointer;
}
.rx-btn {
  -webkit-appearance: none;
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  width: 100%;
  height: 34px;
}
.rx-btn:active {
  background: #e5e5e5;
}
.rx-from-group {
  box-sizing: border-box;
  margin-bottom: 10px;
}
.rx-from-group input {
  width: 100%;
  border: 1px solid #ddd;
  outline: none;
  line-height: 30px;
  padding: 0 7px;
}
</style>

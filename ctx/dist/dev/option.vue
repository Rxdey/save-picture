<template>
  <div class="container">
    <p v-show="!list.length">
      暂无收藏
    </p>
    <div class="user-image">
      <div class="image-block" v-for="(group,index) in imageList" :key="index">
        <div class="title">
          <p>{{group[0].from_path | hideHttp}}</p>
        </div>
        <ul class="image-list">
          <li class="image-list-child" v-for="(item, index) in group" :key="item.id" @click="handleImageClick(group,item)">
            <div class="date">{{item.create_date | dateFormat}} <p class="remove" @click.stop="handleDelete(item,index)">删</p></div>
            <div class="img" :style="`background-image:url('${item.imgSrc}')`"></div>
          </li>
        </ul>
      </div>
    </div>
    <transition name="scale">
      <div class="img-preview" v-show="isPreview"  @click="handleClose" >
        <div class="preview"  @click.stop="previewClick" >
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
  </div>
</template>

<script>
import http from './server/index.js';

const getPath = /.+[\.\/]([A-z0-9]+\.[A-z0-9]+)\/[^\/].+/;
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
      imageList: null
    }
  },
  filters: {
    hideHttp (val) {
      return val.replace(getPath, "$1");
    },
    dateFormat (date) {
      const temp = new Date(date);
      return `${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()} ${temp.getHours()}:${temp.getMinutes()}:${temp.getSeconds()}`
    }
  },
  mounted () {
    this.getDate();
  },
  methods: {
    previewClick(){
      return false
    },
    async handleDelete(item,index){
      const url = {
        url: 'http://localhost:3000/api/del',
        method: 'post'
      }
      const res = await http(url,{id:item.id});
      alert(res.data.message);
      this.imageList[this.activeTarget].splice(index,1);
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
        let path = next.from_path.replace(getPath, "$1");
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
    async getDate () {
      const url = {
        url: 'http://localhost:3000/api/allpic',
        method: 'post'
      }
      const res = await http(url);
      this.list = res.data.data;
      this.$nextTick(() => {
        this.imageList = this.grouping(this.list);
      })
    }
  },
  components: {
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
.image-list {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  padding: 15px 0 15px 0;
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
.remove{
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
  max-width: 500px;
  /* max-height: 500px; */
}
.preview img {
  /* max-width: 800px; */
  max-width: 100%;
  max-height: 100%;
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
</style>

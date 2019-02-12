<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import tronweb from 'tronweb'
// import 'semantic-ui/dist/semantic.min.css'
import $ from 'jquery'
import axios from 'axios'
import VueAnalytics from 'vue-analytics'

const isProd = process.env.NODE_ENV === 'production'
Vue.use(require('vue-truncate-filter'))
Vue.use(require('vue-moment'))
Vue.filter('fromSun', (value) => {
  return Number(tronweb.fromSun(value))
})
Vue.filter('toLocaleString', (value) => {
  return value.toLocaleString(undefined, { maximumFractionDigits: 20 })
})
Vue.filter('tokenId', (value, type) => {
  if (!value) {
    return
  }
  if (value.indexOf(':') === -1) {
    return value
  }
  const c = value.split(':')
  if (type === 'id') {
    return c[0]
  } else {
    return c[1]
  }
})

export default {
  name: 'App',
  methods: {
    resizeBckgd () {
      var body = document.body, html = document.documentElement
      var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      $('body').css('height', height + 'px')
    }
  },
  mounted () {
    Vue.use(VueAnalytics, {
      id: 'UA-1016076-27',
      router: this.$router,
      debug: {
        enabled: !isProd,
        sendHitTask: isProd
      }
    })
    $(window).resize(() => {
      this.resizeBckgd()
    })
    axios.interceptors.response.use((response) => {
      this.resizeBckgd()
      return response
    }, function (error) {
      return Promise.reject(error)
    })
  }
}
</script>

<style>
[v-cloak] > * { display:none; }
[v-cloak]::before { content: "loading..."; }

@import url(https://fonts.googleapis.com/css?family=Exo+2:400,700);
body, html {
height: 100%;
}
body {
font-family: 'Exo 2';
line-height: 1.4;
height: 100%;
position: relative
}
h1, h2, h3, h4, h5 {
font-family: 'Exo 2';
}
[v-cloak] {display: none}
.ui.secondary.pointing.menu{
border-bottom:0px;
}
.ui.menu .item>img:not(.ui){
width: inherit;
}
.ui.statistic>.value, .ui.statistics .statistic>.value{
font-family: 'Exo 2';
}
body::before {
content: "";
opacity: 0.4;
top: 0;
left: 0;
bottom: 0;
right: 0;
position: absolute;
z-index: -1;
height: 100%;
background-color:  #f5f5f5;
background-image: linear-gradient(to bottom, rgba(255,255,255,0) 20%,rgba(255,255,255,1)),url('/statics/images/tron_bkg.png');
background-repeat: no-repeat;
background-attachment: fixed;
background-size: contain;
background-position: center;
}
.ui.menu,.ui.header{
font-family: 'Exo 2';
}
.ui.menu .item {
color: #4183c4;
}
.homemenu .ui.menu .item {
color: #000;
}
.home{
background:#eee;
}
.ui.vertical.segment.hero{
z-index: 2;
}
.ui.stackable.borderless.main.menu{
margin-top: 0px;
}
.eyecatcher {
background-color: #5f5554;
height: 4px;
width: 100%;
z-index: 1;
float: left;
}
.ui.borderless.main.menu a.item{
color:#5f5655;
font-weight:bold;
}
.navbar-toggle{
border-color: #A1580B;
}
.navbar-toggle .icon-bar{
background-color: #A1580B;
}
/**
 * FOOTER
 */

.bottom-menu{
 height: 30px;
}
.bottom-menu .socialite{
width:50px;
float:left;
margin-left:10px;
margin-top:3px;
}
p{
font-size: 16px;
}
.background {
padding: 19px 29px 29px;
background-color: #fff;
border: 1px solid #e5e5e5;
-webkit-border-radius: 5px;
-moz-border-radius: 5px;
border-radius: 5px;
-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.05);
-moz-box-shadow: 0 1px 2px rgba(0,0,0,.05);
box-shadow: 0 1px 2px rgba(0,0,0,.05);
min-height: 10em;
}
.masthead{
text-shadow: 1px 1px 2px rgba(0,0,0,0.25);
/*background: url(/statis/images/fond_2048.jpg) no-repeat center -125px;*/
-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
background-size: cover;
min-height: 380px;
/*-webkit-filter: blur(2px); filter: blur(2px);*/
}
.parsley-error{
color: #B94A48;
background-color: #F2DEDE;
border: 1px solid #EED3D7;
}
.parsley-success{
color: #468847;
background-color: #DFF0D8;
border: 1px solid #D6E9C6;
}
.parsley-required{
color:red;
}
.homesearch{
margin-top:150px;
}
.slider-separator{
height:5px;
background-color:#3C3C3C;
position: relative;
}
/**slider arrow**/
.slider-separator:after {
top: 100%;
left: 50%;
border: solid transparent;
content: " ";
height: 0;
width: 0;
position: absolute;
pointer-events: none;
border-color: rgba(70, 203, 213, 0);
border-top-color: #3C3C3C;
border-width: 20px;
margin-left: -20px;
}
footer p {
font-size:12px;
}
footer {
padding: 40px 0;
color: #999;
background-color: #262626;
border-top: 1px solid #e5e5e5;
font-size: 0.8em;
}
footer a, footer a:hover {
color:#fff;
}
</style>

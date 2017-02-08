import Vue from 'vue'

const REACTIONS = {
  like: {},
  love: {},
  sad: {},
  haha: {},
  angry: {},
  wow: {},
};

const FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v2.8/';

let app = new Vue({
  el: '#app',
  data: {
    accessToken: null,
    postId: null,
    intervalSec: 3,
    window: {
      size: {
        width: 1280,
        height: 720
      }
    },
    deadline: null,
    vs: {
      left: {
        count: 0,
        reaction: null
      },
      right: {
        count: 0,
        reaction: null
      }
    },

    _xhr: null
  },
  computed: {
    xhr: () => {
      if(this._xhr) return this._xhr;
      this._xhr = new XMLHttpRequest();
      xhr.open('GET', FACEBOOK_GRAPH_API_URL + '?ids');
    }
  },

  methods: {
    run: () => {

    },

    updateCount: () => {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', 'myservice/username?id=some-unique-id');
    }
  }
});



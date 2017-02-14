(function() {
  var FACEBOOK_GRAPH_API_URL, REACTIONS, WINDOW_RESOLUTIONS, app;

  FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v2.8/';

  REACTIONS = ['like', 'love', 'sad', 'haha', 'angry', 'wow'];

  WINDOW_RESOLUTIONS = {
    '720p': {
      width: 1280,
      height: 720
    },
    '1080i': {
      width: 1920,
      height: 1080
    }
  };

  Vue.component('vue-add-reactions', {
    template: '#vue-add-reactions',
    props: {
      reaction: Object
    },
    computed: {
      selectableReactions: function() {
        return REACTIONS;
      }
    },
    methods: {
      remove: function() {
        console.log('onClickRemoveReaction');
        console.log(this.reaction._uid);
        return this.$emit('remove', this.reaction._uid);
      }
    },
    created: function() {
      return this.reaction._uid = new Date().getTime().toString(16);
    }
  });

  Vue.component('vue-screen-reaction', {
    template: '#vue-screen-reaction',
    props: {
      reaction: Object,
      padding: Number,
      fontSize: Number
    }
  });

  app = new Vue({
    el: '#app',
    data: function() {
      return {
        accessToken: '',
        postId: '',
        intervalSec: 3,
        screenSize: '720p',
        countdownMinutes: null,
        reactions: [
          {
            name: REACTIONS[0],
            count: 0
          }, {
            name: REACTIONS[1],
            count: 0
          }
        ],
        reactionFontSize: 36,
        reactionPadding: 10,
        _timeoutId: null,
        openConfig: true,
        running: false,
        error: null
      };
    },
    computed: {
      isLocalStorage: function() {
        return localStorage !== null;
      },
      isAccessible: function() {
        var ref;
        return this.accessToken && this.postId && ((ref = this.reactions) != null ? ref.length : void 0) > 0 && !this.error;
      },
      intervalMSec: function() {
        return this.intervalSec * 1000;
      },
      resolution: function() {
        return WINDOW_RESOLUTIONS[this.screenSize];
      },
      selectableCountdownMinutes: function() {
        var num;
        return (function() {
          var j, results;
          results = [];
          for (num = j = 36; j >= 1; num = --j) {
            results.push(num * 5);
          }
          return results;
        })();
      }
    },
    watch: {
      accessToken: function(val) {
        if (this.isLocalStorage) {
          localStorage.accessToken = val;
        }
        return this.run();
      },
      postId: function(val) {
        if (this.isLocalStorage) {
          localStorage.postId = val;
        }
        return this.run();
      }
    },
    methods: {
      run: function() {
        if (this.isAccessible && !this.running) {
          this.running = true;
          return this.update();
        } else {
          return this.running = false;
        }
      },
      update: function() {
        if (!this.running) {
          return;
        }
        this.updateCount();
        clearTimeout(this._timeoutId);
        return this._timeoutId = setTimeout((function(_this) {
          return function() {
            return _this.update();
          };
        })(this), this.intervalMSec);
      },
      stop: function() {
        return this.running = false;
      },
      updateCount: function() {
        var fields, fieldsString, j, len, params, query, r, ref, xhr;
        xhr = new XMLHttpRequest();
        fields = [];
        ref = this.reactions;
        for (j = 0, len = ref.length; j < len; j++) {
          r = ref[j];
          if (!r.name) {
            continue;
          }
          if (r.name === 'undefined') {
            continue;
          }
          if (fields.indexOf(r.name) >= 0) {
            continue;
          }
          fields.push(r.name);
        }
        fieldsString = fields.map(function(e) {
          return "reactions.type(" + (e.toUpperCase()) + ").limit(0).summary(total_count).as(reactions_" + (e.toLowerCase()) + ")";
        }).join(',');
        params = {
          fields: fieldsString,
          access_token: this.accessToken,
          ids: this.postId
        };
        query = Object.keys(params).reduce(function(a, k) {
          a.push(k + "=" + (encodeURIComponent(params[k])));
          return a;
        }, []).join('&');
        xhr.open('GET', FACEBOOK_GRAPH_API_URL + "?" + query, true);
        xhr.onload = (function(_this) {
          return function() {
            var index, l, len1, reactionResult, ref1, ref2, ref3, res, results;
            res = JSON.parse(xhr.responseText);
            if (xhr.status === 200 && xhr.status < 400) {
              ref1 = _this.reactions;
              results = [];
              for (index = l = 0, len1 = ref1.length; l < len1; index = ++l) {
                r = ref1[index];
                if (r.name) {
                  reactionResult = (ref2 = res[_this.postId]) != null ? ref2["reactions_" + (r.name.toLowerCase())] : void 0;
                  if (reactionResult) {
                    results.push(_this.$set(_this.reactions[index], "count", reactionResult.summary.total_count));
                  } else {
                    results.push(void 0);
                  }
                } else {
                  results.push(void 0);
                }
              }
              return results;
            } else {
              _this.stop();
              return alert((ref3 = res.error) != null ? ref3.message : void 0);
            }
          };
        })(this);
        xhr.onerror = (function(_this) {
          return function() {
            _this.stop();
            return alert('Network Error!');
          };
        })(this);
        return xhr.send();
      },
      toggleConfigOpen: function() {
        return this.openConfig = !this.openConfig;
      },
      addReaction: function() {
        return this.reactions.push({
          name: 'undefined',
          count: 0
        });
      },
      removeReaction: function(id) {
        var i, j, len, r, ref;
        console.log(id);
        if (!id) {
          return;
        }
        ref = this.reactions;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          r = ref[i];
          console.log(r);
          if (r._uid === id) {
            this.reactions.splice(i, 1);
            return;
          }
        }
      }
    },
    mounted: function() {
      if (this.isLocalStorage) {
        if (localStorage.accessToken) {
          this.accessToken = localStorage.accessToken;
        }
        if (localStorage.postId) {
          this.postId = localStorage.postId;
        }
      }
      return this.run();
    }
  });

}).call(this);

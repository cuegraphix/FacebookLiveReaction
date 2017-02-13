FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v2.8/'
REACTIONS = [
  'like'
  'love'
  'sad'
  'haha'
  'angry'
  'wow'
]
WINDOW_RESOLUTIONS =
  '720p':
    width: 1280
    height: 720
  '1080i':
    width: 1920
    height: 1080


Vue.component 'vue-add-reactions',
  template: '#vue-add-reactions'
  props:
    reaction: Object
  computed:
    selectableReactions: ->
      return REACTIONS


app = new Vue
  el: '#app'
  data: ->
    accessToken: '',
    postId: '',
    intervalSec: 3,
    screenSize: '720p'
    countdownMinutes: null
    reactions: [
      { name: REACTIONS[0] }
      { name: REACTIONS[1] }
    ]

    _timeoutId: null
    openConfig: true
    running: false
    error: null

  computed:
    isLocalStorage: ->
      return window.localStorage isnt null

    isAccessible: ->
      return @accessToken and @postId and @reactions?.length > 0 and !@error

    intervalMSec: ->
      return @intervalSec * 1000

    resolution: ->
      return WINDOW_RESOLUTIONS[@screenSize]

    selectableCountdownMinutes: ->
      return (num * 5 for num in [36..1])

  watch:
    accessToken: (val)->
      window.localStorage.accessToken = val if @isLocalStorage
      @run()
    postId: (val)->
      window.localStorage.postId = val if @isLocalStorage
      @run()

  methods:
    run: ()->
      if @isAccessible and !@running
        @running = true
        @update()
      else
        @running = false

    update: ()->
      return unless @running
      @updateCount()
      clearTimeout @_timeoutId
      @_timeoutId = setTimeout =>
        @update()
      , @intervalMSec

    stop: ->
      @running = false

    updateCount: ->
      xhr = new XMLHttpRequest()

      fields = []
      for r in @reactions
        continue unless r.name
        continue if fields.indexOf(r.name) >= 0
        fields.push r.name
      fieldsString = fields.map (e)->
        return "reactions.type(#{e.toUpperCase()}).limit(0).summary(total_count).as(reactions_#{e.toLowerCase()})"
      .join ','

      params =
        fields: fieldsString
        access_token: @accessToken
        ids: @postId
      query = Object.keys(params).reduce((a,k)->
        a.push "#{k}=#{encodeURIComponent(params[k])}"
        a
      ,[]).join '&'
      xhr.open 'GET', "#{FACEBOOK_GRAPH_API_URL}?#{query}", true
      xhr.onload = =>
        res = JSON.parse xhr.responseText
        if xhr.status is 200 and xhr.status < 400

          for r, index in @reactions
            if r.name
              @$set @reactions[index], "count", res[@postId]["reactions_#{r.name.toLowerCase()}"].summary.total_count
        else
          @stop()
          alert res.error?.message
      xhr.onerror = =>
        @stop()
        alert 'Network Error!'
      xhr.send()

    toggleConfigOpen: ->
      @openConfig = !@openConfig

    addReaction: ->
      @reactions.push {}

  mounted: ->
    if @isLocalStorage
      @accessToken = window.localStorage.accessToken
      @postId = window.localStorage.postId
    @run()
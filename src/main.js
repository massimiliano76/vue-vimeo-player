  import Player from '@vimeo/player'

  let pid = 0

  function emitVueEvent (event) {
    this.player.on(event, (data) => {
      this.$emit(event, data, this.player)
    })
  }

  const eventsToEmit = [
  'play',
  'pause',
  'ended',
  'timeupdate',
  'progress',
  'seeked',
  'texttrackchange',
  'cuechange',
  'cuepoint',
  'volumechange',
  'error',
  'loaded'
  ]

  export default {
    props: {
      playerHeight: {
        default: null
      },
      playerWidth: {
        default: null
      },
      options: {
        default: () => ({})
      },
      videoId: {
        required: true
      },
      loop: {
        default: false
      },
      autoplay: {
        default: false
      }
    },
    template: '<div :id="elementId"></div>',
    watch: {
      videoId: 'update'
    },
    data () {
      pid += 1

      return {
        elementId: `vimeo-player-${pid}`,
        player: null
      }
    },
    methods: {
      /**
       * Loads a new video ID.
       * Returns a promise
       * @param {Number} videoId
       * @return {LoadVideoPromise}
       */
       update (videoId) {
        return this.player.loadVideo(videoId)
      },
      play () {
        return this.player.play()
      },
      pause () {
        return this.player.pause()
      },
      mute () {
        return this.player.setVolume(0)
      },
      unmute (volume = 0.5) {
        return this.player.setVolume(volume)
      },
      setEvents () {
        const vm = this

        this.player.ready().then(function () {
          vm.$emit('ready', vm.player)
        })

        eventsToEmit.forEach(event => emitVueEvent.call(vm, event))
      }
    },
    mounted () {
      const options = {
        id: this.videoId,
        width: this.playerWidth,
        height: this.playerHeight,
        loop: this.loop,
        autoplay: this.autoplay
      }

      this.player = new Player(this.elementId, Object.assign(options, this.options))

      this.setEvents()
    },
    beforeDestroy () {
      this.player.unload()
    }
  }
<template>
  <div class="VideoCard">
    <div class="Thumbnail">
      <div class="thumbnailBox">
        <img v-if="bringThumbnailUrl !== undefined && bringThumbnailUrl !== 'no-photo.jpg'" :src="bringThumbnailSrc" />
        <!-- :src="`${process.env.VUE_APP_URL}/uploads/avatar/${bringImgUrl}`" -->
        <span v-else class="white--text"></span>
      </div>
    </div>
    <div class="VideoBottom">
      <div class="VideoPhoto">
        <v-btn depressed fab icon router :to="`/channel/${channel.id}`">
          <v-avatar color="red" class="white--text">
            <h1>{{ channel.channelName.split('')[0].toUpperCase() }}</h1>
          </v-avatar>
        </v-btn>
      </div>
      <div class="VideoTittle">
        <p>{{ videoData.title }}</p>
        <p>{{ channelData.channelName }}</p>
        <div class="VideoInfo">
          <span>{{ `${videoData.views} views` }}</span>
          <span>{{ setCalDate(videoData.createdAt) }}</span>
          <!-- <span>{{ videoData.createdAt | moment('YYYY-MM-DD HH:mm') }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
import SetFormat from '@/mixins/SerFormat.vue'

export default {
  name: 'VideoBox',
  mixins: [SetFormat],
  props: {
    video: Object,
    channel: Object
  },
  computed: {
    videoData(props) {
      return props.video
    },
    channelData(props) {
      return props.channel
    },
    bringThumbnailUrl() {
      const thumbnailUrl = this.videoData.thumbnailUrl
      if (thumbnailUrl !== undefined && thumbnailUrl !== 'no-photo.jpg') {
        // const returnUrl = photoUrl.split('avatar-')[1]
        console.log(thumbnailUrl)
        return thumbnailUrl
      }
      return JSON.parse(localStorage.getItem('video')).thumbnailUrl
    },
    bringThumbnailSrc() {
      const src = `${process.env.VUE_APP_URL}/uploads/thumbnails/${this.bringThumbnailUrl}`
      return src
    }
  },
  methods: {}
}
</script>

<style>
.VideoCard {
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
  box-sizing: border-box;
  column-gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}
.Thumbnail {
  background-color: black;
  height: 200px;
  width: 100%;
}
.VideoBottom {
  column-gap: 20px;
  display: grid;
  grid-template-columns: 50px calc(100% - 50px);
  width: 100%;
  margin-top: 10px;
}
.VideoPhoto {
  background-color: black;
  border-radius: 50%;
  height: 50px;
  width: 50px;
}
.VideoTitles {
  align-items: flex-start;
  column-gap: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.VideoInfo span {
  display: inline-block;
  margin-right: 10px;
}
.thumbnailView {
  align-items: center;
  background-color: black;
  color: white;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0px;
  position: absolute;
  top: 0px;
  width: 100%;
}
.thumbnailBox {
  height: 0px;
  overflow: hidden;
  padding-bottom: 56.26%;
  position: relative;
  width: 100%;
}
</style>

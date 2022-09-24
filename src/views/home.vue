<template>
  <div id="Home">
    <VideoBox v-for="video in videos" :key="video.id" :video="video" :channel="video.userId"></VideoBox>
    <!-- <div v-for="video in videos" :key="video.id" class="VideoCard">
      <div class="Thumbnail"></div>
      <div class="VideoBottom">
        <div class="VideoPhoto"></div>
        <div class="VideoTitles">
          <p>{{ video.title }}</p>
          <p>{{ video.userId.channelName }}</p>
          <p></p>
          <div class="VideoInfo">
            <span>{{ video.views }}</span>
            <span>{{ video.createdAt }}</span>
          </div>
          <div></div>
        </div>
      </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import axios from 'axios'
import VideoBox from '@/components/VideoBox.vue'
// import VideoCard from '@/components/VideoCard.vue'

export default {
  name: 'Home',
  components: {
    // videoCard,
    VideoBox
  },
  data: () => ({
    videos: []
  }),
  mounted() {
    this.getVideos()
  },
  methods: {
    async getVideos() {
      await axios
        .get(
          // process.env.VUE_APP_API + '/videos/public',
          // {},
          process.env.VUE_APP_API + '/videos/private',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        .then(response => {
          console.log('getVideos - response : ' + response, response.data.data)
          this.videos = response.data.data
        })
        .catch(error => {
          console.log('getVideos - response : ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#Home {
  display: grid;
  column-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(350px, auto));
  padding: 20px;
  row-gap: 20px;
}
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
</style>

<template>
  <nav>
    <v-app-bar app clipped-left flat class="grey darken-3 white--text">
      <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>VueTubeStudio</v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="checkLoggedIn === true">
        <v-menu offset-y>
          <!-- 상태창 옆에 동영상 업로드 메뉴 -->
          <template #activator="{ on }">
            <v-btn outlined class="mr-3 white--text" v-on="on">
              <v-icon color="red">mdi-video-plus</v-icon>
              Create
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list dense>
              <!-- 업로드 버튼 클릭하면 나오는 리스트 -->
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item @click="openUploadModal">
                  <v-list-item-icon>
                    <v-icon>mdi-video-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>동영상 업로드</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-monitor-edit</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>VueStudio 스튜디오</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-cog</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Configuration 설정</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu offset-y>
          <!-- 맨 오른쪽 상단 상태메뉴 (프로필) -->
          <template #activator="{ on }">
            <v-btn depressed fab icon v-on="on">
              <v-avatar color="grey" size="40">
                <span class="white--text">
                  {{ initial }}
                </span>
              </v-avatar>
            </v-btn>
          </template>
          <!-- 프로필 클릭하면 뜨는 메뉴(카드형식) -->
          <v-card class="mx-auto" max-width="300" tile>
            <v-list dense>
              <v-subheader class="my-2">
                <!-- 프로필 클릭하면 뜨는 메뉴에서 맨윗단 -->
                <div style="display: flex">
                  <v-avatar color="grey" size="48">
                    <img v-if="bringImgUrl !== undefined && bringImgUrl !== 'no-photo.jpg'" :src="bringImgSrc" />
                    <!-- :src="`${process.env.VUE_APP_URL}/uploads/avatar/${bringImgUrl}`" -->
                    <span v-else class="white--text"> {{ initial }}</span>
                  </v-avatar>
                  <div class="mx-2">
                    {{ userChannel }}
                    <br />
                    {{ userEmail }}
                  </div>
                </div>
              </v-subheader>
              <v-divider></v-divider>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>내 채널</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!-- <v-list-item @click="vuetubeStudio"> -->
                <!-- <router-link to="/vuetubeStudio"> -->
                <!-- <v-list-item-icon>
                    <v-icon>mdi-youtube</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>VueTube 스튜디오</v-list-item-title>
                  </v-list-item-content> -->
                <!-- </router-link> -->
                <!-- </v-list-item> -->
                <v-list-item @click="moveToMain">
                  <!-- <router-link to="/vuetubeStudio"> -->
                  <v-list-item-icon>
                    <v-icon>mdi-youtube</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>VueTube 홈</v-list-item-title>
                  </v-list-item-content>
                  <!-- </router-link> -->
                </v-list-item>
                <v-list-item @click="logOut">
                  <v-list-item-icon>
                    <v-icon>mdi-logout-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>로그아웃</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="settingConfig">
                  <v-list-item-icon>
                    <v-icon>mdi-cog</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>설정</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </div>
      <v-btn v-else class="mr-3 white--text" outlined @click="pageRedirect">
        <v-icon>mdi-account-circle</v-icon>
        로그인
      </v-btn>
    </v-app-bar>
    <!-- 내브바 스튜디오 서랍부분 -->
    <v-navigation-drawer v-model="drawer" app clipped class="grey darken-3 white--text">
      <v-list>
        <!-- <v-list-item class="px-2">
          <div class="container">
            <v-list-item-avatar style="justify-center">
              <v-avatar color="grey" size="40">
                <span class="white--text">{{ initial }}</span>
              </v-avatar>
            </v-list-item-avatar>
          </div>
        </v-list-item> -->
        <v-list-item class="profile">
          <v-list-item-content class="white--text">
            <v-list-item-title>My Channel</v-list-item-title>
            <v-list-item-subtitle class="white--text">{{ userChannel }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item @click="dashBoard">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">대시보드</v-list-item-title>
        </v-list-item>
        <v-list-item @click="contents">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-play-box-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">콘텐츠</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- <UploadVideoModal></UploadVideoModal>
    <VideoModal></VideoModal> -->
    <UploadModal :open-dialog="modalStatus" @closeDialog="closeUploadModal"></UploadModal>
  </nav>
</template>

<script>
// import UploadVideoModal from '@/components/Modal/UploadVideoModal.vue'
import UploadModal from '@/components/Modal/UploadModal.vue'
// import VideoModal from '@/components/Modal/VideoModal.vue'

export default {
  name: 'NavBarStudio',
  components: {
    // UploadVideoModal,
    UploadModal
    // VideoModal
  },
  data: () => {
    return {
      drawer: false,
      selectedItem: 1,
      statusModal: false,
      modalStatus: false
    }
  },
  computed: {
    checkLoggedIn() {
      const result = localStorage.getItem('USER')
      console.log(result)
      if (result === undefined || result === null) {
        return false
      } else {
        return JSON.parse(result).success
      }
    },
    initial() {
      if (localStorage.getItem('USER') !== undefined && localStorage.getItem('USER') !== null) {
        const user = JSON.parse(localStorage.getItem('USER')).data.channelName
        console.log(user)
        return user.charAt(0)
      } else return ''
    },
    userChannel() {
      if (localStorage.getItem('USER') !== undefined && localStorage.getItem('USER') !== null) {
        return JSON.parse(localStorage.getItem('USER')).data.channelName
      } else return ''
    },
    userEmail() {
      return JSON.parse(localStorage.getItem('USER')).data.email
    },
    bringImgUrl() {
      const photoUrl = JSON.parse(localStorage.getItem('USER')).data.photoUrl
      if (photoUrl !== undefined && photoUrl !== 'no-photo.jpg') {
        // const returnUrl = photoUrl.split('avatar-')[1]
        console.log(photoUrl)
        return photoUrl
      }
      return JSON.parse(localStorage.getItem('USER')).data.photoUrl
    },
    bringImgSrc() {
      const src = `${process.env.VUE_APP_URL}/uploads/avatars/${this.bringImgUrl}`
      return src
    }
  },
  methods: {
    pageRedirect() {
      this.$router.push('/login')
    },
    logOut() {
      localStorage.removeItem('token')
      localStorage.removeItem('USER')
      window.location.reload()
    },
    vuetubeStudio() {
      const start = this.$router.currentRoute.path
      if (start === '/vuetubeStudio') return
      this.$router.push('/vuetubeStudio')
    },
    dashBoard() {
      const start = this.$router.currentRoute.path
      console.log(start)
      if (start === '/vuetubeStudio') return
      this.$router.push('/vuetubeStudio')
    },
    contents() {
      const start = this.$router.currentRoute.path
      console.log(this.$router.currentRoute.path)
      if (start === '/vuetubeStudio/contents') return
      this.$router.push('/vuetubeStudio/contents')
    },
    openUploadModal() {
      this.modalStatus = true
      console.log('-- open : ', this.modalStatus)
    },
    closeUploadModal() {
      this.modalStatus = false
      console.log('-- close : ', this.modalStatus)
    },
    settingConfig() {
      const start = this.$router.currentRoute.path
      console.log(this.$router.currentRoute)
      console.log(this.$router.currentRoute.path)
      if (start === '/setting') return
      this.$router.push('/setting')
    },
    moveToMain() {
      const start = this.$router.currentRoute.path
      if (start === '/') return
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  justify-content: center;
  display: flex;
}
.profile {
  text-align: center;
}
</style>

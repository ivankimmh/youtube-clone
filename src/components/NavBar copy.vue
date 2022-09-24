<template>
  <nav>
    <v-app-bar app clipped-left flat class="yellow lighten-5">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>VueTube</v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="checkLoggedIn === true">
        <v-menu offset-y left>
          <template #activator="{ on }">
            <v-btn depressed fab icon v-on="on"><v-icon>mdi-video-plus</v-icon></v-btn>
          </template>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list dense>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item @click="showUploadModal">
                  <v-list-item-icon>
                    <v-icon>mdi-play-box-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>동영상 업로드</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn depressed fab icon v-on="on">
              <v-avatar color="orange" size="40"
                ><span v-if="avataStatus" class="white--text"> {{ initial }}</span>
                <span v-else><img :src="`${imgurl}`" alt="avatar_img" /></span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list dense>
              <v-subheader class="my-2">
                <div style="display: flex">
                  <v-avatar color="orange" size="40"
                    ><span v-if="avataStatus" class="white--text"> {{ initial }}</span>
                    <span v-else><img :src="`${imgurl}`" alt="avatar_img" /></span
                  ></v-avatar>
                  <div class="mx-2">
                    {{ userChannel }} <br />
                    {{ userEmail }}
                  </div>
                </div>
              </v-subheader>
              <v-divider></v-divider>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item @click="setting">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>내 채널</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="vuetubeStudio">
                  <!-- <router-link to="/vuetubeStudio"> -->
                  <v-list-item-icon>
                    <v-icon>mdi-youtube</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>VueTube 스튜디오</v-list-item-title>
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
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </div>
      <v-btn v-else outlined @click="pageRedirect"><v-icon>mdi-account-circle</v-icon>로그인</v-btn>
    </v-app-bar>
    <!-- 내브바 서랍 메뉴 -->
    <v-navigation-drawer v-model="drawer" app clipped class="yellow lighten-5">
      <v-list nav dense>
        <v-list-item @click="home">
          <v-list-item-icon>
            <v-icon>mdi-home-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>홈</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-youtube-subscription</v-icon>
          </v-list-item-icon>
          <v-list-item-title>구독</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-history</v-icon>
          </v-list-item-icon>
          <v-list-item-title>시청 기록</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <UploadModal :open-dialog="modalStatus" @closeDialog="unshowUploadModal"></UploadModal>
  </nav>
</template>

<script>
import UploadModal from '@/components/Modal/UploadModal.vue'
export default {
  name: 'NavBar',
  components: {
    UploadModal
  },
  data: () => {
    return {
      drawer: true,
      selectedItem: 1,
      modalStatus: false,
      imgUrl: ''
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
    profileCheck() {
      const result = localStorage.getItem('USER')
      console.log('유저아이디 어케나오니' + JSON.parse(result))
      if (result === undefined || result === 'no-photo.jpg') {
        return false
      } else {
        return JSON.parse(result)
      }
    },
    initial() {
      const user = JSON.parse(localStorage.getItem('USER')).data.channelName
      console.log(user)
      console.log(JSON.parse(localStorage.getItem('USER')))
      console.log(JSON.parse(localStorage.getItem('USER')).data)
      return user.charAt(0)
    },
    userChannel() {
      return JSON.parse(localStorage.getItem('USER')).data.channelName
    },
    userEmail() {
      return JSON.parse(localStorage.getItem('USER')).data.email
    },
    avataStatus() {
      if (JSON.parse(localStorage.getItem('USER')).data.photoUrl === 'no-photo.jpg') {
        console.log(JSON.parse(localStorage.getItem('USER')).data.photoUrl)
        console.log('메롱')
        return true
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.imgurl = `${process.env.VUE_APP_URL}/uploads/avatars/${
          JSON.parse(localStorage.getItem('USER')).data.photoUrl
        }`
        console.log(JSON.parse(localStorage.getItem('USER')).data.photoUrl)
        return false
      }
    }
  },
  methods: {
    pageRedirect() {
      this.$router.push('/login')
    },
    home() {
      this.$router.push('/')
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
    setting() {
      const start = this.$router.currentRoute.path
      if (start === '/setting') return
      this.$router.push('/setting')
    },

    //모달 열고 닫는 함수
    showUploadModal() {
      this.modalStatus = true
      console.log('-- open :', this.modalStatus)
    },
    unshowUploadModal() {
      this.modalStatus = false
      console.log('-- close :', this.modalStatus)
    }
  }
}
</script>

<style lang="scss" scoped></style>

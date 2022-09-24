<template>
  <nav>
    <v-app-bar app clipped-left class="grey darken-3 white--text">
      <!-- 내브바 상단 메뉴 -->
      <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn depressed fav icon @click="moveToMain">
        <v-icon color="red" size="50px">mdi-youtube</v-icon>
      </v-btn>
      <v-app-bar-title style="font-size: 23px" @click="moveToMain">VueTube</v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="checkLoggedIn">
        <!-- 상태창 옆에 동영상 업로드 메뉴 -->
        <!-- <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn outlined class="mr-3 white--text" v-on="on">
              <v-icon color="red">mdi-video-plus</v-icon>
              Create
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list dense>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-video-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>동영상 업로드</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu> -->

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
      <v-btn v-else outlined class="mr-3 white--text" @click="pageRedirect">
        <v-icon>mdi-account-circle</v-icon>
        로그인
      </v-btn>
    </v-app-bar>
    <!-- 내브바 서랍 메뉴 -->
    <v-navigation-drawer v-model="drawer" app class="grey darken-3 white--text">
      <v-list>
        <!-- <v-list-item class="px-2">
          <div class="container" style="justify-center">
            <v-list-item-avatar style="justify-center"> 
              <v-avatar color="grey" size="40">
                <span class="white--text">{{ initial }}</span>
              </v-avatar>
            </v-list-item-avatar>
          </div>
        </v-list-item> -->
        <v-list-item class="profile">
          <v-list-item-content class="white--text">
            <span>
              <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
              <v-icon color="red" size="50px">mdi-youtube</v-icon>
              VueTube
              <!-- <span style="font-size: 23px; margin-bottom: 50px">VueTube</span> -->
            </span>
            <!-- <span>
              <v-list-item-title font-size="30px">
                <v-icon color="red" size="50px">mdi-youtube</v-icon>
                VueTube
              </v-list-item-title>
            </span> -->
            <!-- <v-list-item-subtitle class="white--text">{{ userChannel }}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item @click="home">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-home-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">홈</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="white--text">mdi-youtube-subscription</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">구독</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="white--text">mdi-history</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">시청 기록</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data: () => ({
    drawer: false,
    selectedItem: 1
  }),
  computed: {
    checkLoggedIn() {
      const result = localStorage.getItem('USER')
      console.log(result)
      if (result !== undefined && result !== null) {
        return true
      } else {
        return false
        // return JSON.parse(result).success
      }
    },
    initial() {
      if (localStorage.getItem('USER') !== undefined && localStorage.getItem('USER') !== null) {
        const user = JSON.parse(localStorage.getItem('USER')).data.channelName
        // console.log('this is the user', user)
        // console.log('detailed info localStorage', localStorage.getItem('USER'))
        // console.log('detailed info JSON', JSON.parse(localStorage.getItem('USER')))
        // console.log('detailed info data', JSON.parse(localStorage.getItem('USER')).data)

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
    home() {
      const start = this.$router.currentRoute.path
      if (start === '/') return
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
  margin-top: -10px;
  text-align: left;
  font-size: 23px;
}
</style>

<template>
  <div class="container">
    <ValidationObserver ref="logInForm" v-slot="{ handleSubmit, invalid, validate }">
      <form @submit.prevent="handleSubmit(login)">
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">VueTube</div>
              <v-list-item-title class="text-h5 mb-5"> 로그인 </v-list-item-title>
              <div>
                <ValidationProvider v-slot="{ errors }" name="이메일" rules="required|email">
                  <v-text-field v-model="email" placeholder="e-mail" label="e-mail" outlined>
                    <span class="errorText">{{ errors[0] }}</span>
                  </v-text-field>
                </ValidationProvider>
              </div>
              <div>
                <ValidationProvider v-slot="{ errors }" name="비밀번호" rules="required">
                  <v-text-field v-model="password" placeholder="password" label="password" outlined type="password">
                    <span class="errorText">{{ errors[0] }}</span>
                  </v-text-field>
                </ValidationProvider>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions class="buttons">
            <v-btn text color="teal accent-4" href="/join" @click="reveal = true"> 계정 만들기 </v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" type="submit" :disabled="invalid || !validate" @click="login">
              login
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import axios from 'axios'
import Validate from '@/mixins/Validate.vue'

export default {
  name: 'Login',
  mixins: [Validate],

  data: () => ({
    email: '',
    password: '',
    loading: false
  }),
  methods: {
    async login() {
      if (this.loading) return
      this.loading = true

      const axiosBody = {
        email: this.email,
        password: this.password
      }
      console.log('auth/login - axiosBody : ', axiosBody)

      await axios
        .post(process.env.VUE_APP_API + '/auth/login', axiosBody)
        .then(async response => {
          console.log('auth/login - response : ', response)
          localStorage.setItem('token', response.data.token)
          await axios
            .post(
              process.env.VUE_APP_API + '/auth/me',
              {},
              {
                headers: {
                  Authorization: `Bearer ${response.data.token}`
                }
              }
            )
            .then(response => {
              console.log('/auth/me - _response : ', response)
              localStorage.setItem('USER', JSON.stringify(response.data))
              // localStorage.setItem('user', JSON.stringify(_response.data))
              // const result = JSON.parse(localStorage.getItem('user'))
              this.$router.push({ name: 'home' })
            })
            .catch(error => {
              console.log('/auth/me - _error : ', error)

              // 에러문구 표시
              this.$refs.signInForm.setErrors({
                이메일: ['이메일을 확인해주세요.'],
                비밀번호: ['비밀번호를 확인해주세요.']
              })

              this.loading = false
            })
        })
        .catch(error => {
          console.log('auth/login - error : ', error)

          // 에러문구 표시
          this.$refs.signInForm.setErrors({
            이메일: ['이메일을 확인해주세요.'],
            비밀번호: ['비밀번호를 확인해주세요.']
          })

          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.container {
  justify-content: center;
  align-items: center;
  height: 100vh;
  display: flex;
}
.buttons {
  margin-left: 1vh;
  margin-right: 1vh;
  margin-bottom: 1vh;
}
</style>

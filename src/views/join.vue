<template>
  <div class="container">
    <v-card class="mx-auto" max-width="500" outlined>
      <ValidationObserver ref="joinForm" v-slot="{ handleSubmit, invalid, validate }">
        <v-form @submit.prevent="handleSubmit(join)">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">VueTube</div>
              <v-spacer></v-spacer>
              <v-row>
                <v-col cols="12" sm="20">
                  <v-list-item-title class="text-h5 mb-1"> VueTube 계정 만들기 </v-list-item-title>
                </v-col>
              </v-row>
              <ValidationProvider v-slot="{ errors }" name="이메일" rules="required|email">
                <div>
                  <v-text-field
                    v-model="email"
                    placeholder="이메일주소"
                    label="이메일주소"
                    :error-messages="errors"
                    outlined
                  ></v-text-field>
                </div>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="채널명" rules="required">
                <div>
                  <v-text-field
                    v-model="channelName"
                    placeholder="채널명"
                    label="채널명"
                    :error-messages="errors"
                    outlined
                  ></v-text-field>
                </div>
              </ValidationProvider>
              <div>
                <ValidationProvider v-slot="{ errors }" name="비밀번호" rules="required|min:6">
                  <v-text-field
                    v-model="password"
                    placeholder="비밀번호"
                    label="비밀번호"
                    type="password"
                    :error-messages="errors"
                    outlined
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="비밀번호확인" rules="required|confirmed:비밀번호">
                  <v-text-field
                    v-model="confirmPassword"
                    placeholder="확인"
                    label="확인"
                    type="password"
                    :error-messages="errors"
                    outlined
                  ></v-text-field>
                </ValidationProvider>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions class="buttons">
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" type="submit" :loading="loading" :disabled="invalid || !validate">
              submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </ValidationObserver>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import Validate from '@/mixins/Validate.vue'
export default {
  name: 'Join',

  mixins: [Validate],

  data: () => ({
    channelName: '',
    confirmPassword: '',
    email: '',
    password: '',
    loading: false
  }),
  methods: {
    async join() {
      if (this.loading) return
      this.loading = true

      const axiosBody = {
        email: this.email,
        channelName: this.channelName,
        password: this.password
      }
      console.log('auth/register - axiosBody : ', axiosBody)

      await axios
        .post(process.env.VUE_APP_URL + '/api/v1/auth/register', axiosBody)
        .then(async response => {
          console.log('auth/register - response : ', response)
          localStorage.setItem('token', response.data.token)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
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

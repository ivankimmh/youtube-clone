<template>
  <v-container fluid class="full-height pa-10">
    <ValidationObserver v-slot="{ handleSubmit, invalid }">
      <form @submit.prevent="handleSubmit(submitData)">
        <p>Channel Name</p>
        <ValidationProvider v-slot="{ errors }" name="Channel Name" rules="required">
          <!-- ChannelName -->
          <v-text-field v-model="channelName" outline type="text" :error-messages="errors"></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="avatar" rules="required">
          <!-- avatar -->
          <v-file-input v-model="avatar" accept="image/*" :error-messages="errors"></v-file-input>
        </ValidationProvider>

        <v-btn type="submit" :disabled="invalid">Change</v-btn>
      </form>

      <p>Email</p>
      <v-text-field v-model="email" disabled outline type="text"> </v-text-field>
    </ValidationObserver>
  </v-container>
</template>

<script>
// import { mapGetters } from 'vuex'
import Validate from '@/mixins/Validate.vue'
import axios from 'axios'

export default {
  name: 'Setting',
  mixins: [Validate],
  data: () => ({
    channelName: '',
    avatar: [],
    email: ''
  }),
  computed: {},
  mounted() {
    const userData = JSON.parse(localStorage.getItem('USER')).data
    this.channelName = userData.channelName
    this.email = userData.email
    console.log(this.channelName)
    console.log(this.email)
  },
  methods: {
    async submitData() {
      const axiosBody = {
        channelName: this.channelName,
        email: this.email
      }
      console.log('submitData - axiosBody : ', axiosBody)

      const photoFormData = new FormData()
      photoFormData.append('avatar', this.avatar, this.avatar.name)
      console.log('submitData - avatar : ', this.avatar, this.avatar.name)
      // process.env.VUE_APP_URL/uploads/avatars/(required_url)

      await axios
        .put(process.env.VUE_APP_API + '/auth/avatar', photoFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('submitData - response : ', response)
          localStorage.setItem('USER', JSON.stringify(response.data))
        })
        .catch(error => {
          console.log('submitData - error : ', error)
        })

      await axios
        .put(process.env.VUE_APP_API + '/auth/updatedetails', axiosBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('submitData - response : ', response)
          localStorage.setItem('USER', JSON.stringify(response.data))
        })
        .catch(error => {
          console.log('submitData - error : ', error)
        })
    },
    async submitUpdateData() {}
  }
}

/* Vuex의 데이터 관리 방향(store)
 * 각각의 컴포넌트 (dispatch)
 * --> actions(commit)
 * --> mutations(state)
 * --> state
 * --> 모든 컴포넌트에서 활용
 */
</script>

<style></style>

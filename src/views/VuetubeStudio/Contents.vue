<template>
  <div>
    <h2>채널 콘텐츠</h2>

    <v-tabs v-model="tab" class="mt-5">
      <v-tab>동영상</v-tab>
      <v-tab>동영상 관리</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <table class="tableStyle">
          <thead>
            <tr>
              <th>동영상</th>
              <th>공개상태</th>
              <th>조회수</th>
              <th>좋아요</th>
              <th>생성날짜</th>
              <th>수정날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in videos" :key="video.id">
              <th>{{ video.title }}</th>
              <th>{{ video.status }}</th>
              <th>{{ video.views }}</th>
              <th>{{ video.likes }}</th>
              <th>{{ setCalDate(video.createdAt) }}</th>
              <th>{{ setCalDate(video.updatedAt) }}</th>
            </tr>
          </tbody>
        </table>
      </v-tab-item>

      <v-tab-item>
        <v-data-table class="tableStyle" :headers="headers" :items="videos">
          <!-- <template #[`item.feelings`]="{ item }">
            <span class="mr-3">
              <v-icon small class="pr-1">mdi-thumb-up</v-icon>
              {{ item.likes }}
            </span>
            <span class="mr-3">
              <v-icon small class="pr-1">mdi-thumb-down</v-icon>
              {{ item.dislikes }}
            </span>
          </template>
          <template #[`item.createdAt`]="{ item }">
            <span class="mr-3">
              {{ setCalDate(item.createdAt) }}
            </span>
          </template>
          <template #[`item.updatedAt`]="{ item }">
            <span class="mr-3">
              {{ setCalDate(item.updatedAt) }}
            </span>
          </template> -->
          <template #item="{ item }">
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.status }}</td>
              <td>
                {{ item.views }}
                <!-- <v-chip :color="setViewChip(item.views)" class="white--text">
                  {{ item.views }}
                </v-chip> -->
              </td>
              <td>
                <span class="mr-3">
                  <v-icon small class="pr-1">mdi-thumb-up</v-icon>
                  {{ item.likes }}
                  <v-icon small class="pr-1">mdi-thumb-down</v-icon>
                  {{ item.dislikes }}
                </span>
              </td>
              <td>{{ item.createdAt | moment('YYYY-MM-DD HH:mm:ss') }}</td>
              <td>{{ setDateFormat(item.updatedAt) }}</td>
              <td>
                <v-btn elevation="3" @click="editVideo(item)">Edi</v-btn>
                <v-btn elevation="3" @click="deleteVideo(item)">Del</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import axios from 'axios'
import SetFormat from '@/mixins/SerFormat.vue'

export default {
  name: 'Contents',
  mixins: [SetFormat],
  data: () => ({
    tab: null,
    headers: [
      {
        text: '동영상',
        align: 'start',
        value: 'title'
      },
      { text: '공개상태', value: 'status' },
      { text: '조회수', value: 'views' },
      { text: '좋아요', value: 'feelings' },
      { text: '생성날짜', value: 'createdAt' },
      { text: '수정날짜', value: 'updatedAt' },
      { text: 'Act', value: 'manageVideo' }
    ],
    videos: [
      {
        id: 123,
        title: 'title',
        description: 'description',
        status: 'private',
        views: 123,
        likes: 123,
        dislike: 123,
        createdAt: '2022-09-23',
        updatedAt: '2022-09.23'
      }
    ]
  }),
  mounted() {
    this.getVideos()
  },
  methods: {
    async getVideos() {
      await axios
        // .get(process.env.VUE_APP_API + '/videos/public, {}', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        .get(process.env.VUE_APP_API + '/videos/private', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('getVideos - response : ' + response, response.data.data)
          this.videos = response.data.data
        })
        .catch(error => {
          console.log('getVideos - response : ' + error)
        })
    },
    async editVideo(video) {
      console.log(video)
      this.$router.push({
        name: 'Edit',
        query: { data: JSON.stringify(video) }
      })
    },
    async deleteVideo(video) {
      console.log(video)
      if (confirm('Do you want to delete it?')) {
        await axios
          .delete(`${process.env.VUE_APP_API}/videos/${video.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(response => {
            console.log('deleteVideo - response : ', response)
            alert('Deleted !!')
            this.getVideos()
          })
          .catch(error => {
            console.log('deleteVideo - error : ', error)
          })
      } else return
    }
  }
}
</script>

<style lang="scss" scoped>
.tableStyle {
  width: 100%;
  border-collapse: collapse;
  margin: 10px auto;
  table-layout: fixed;
}
th,
td {
  border-bottom: 1px solid rgb(241, 179, 22);
}
.tableStyle th {
  font-size: 15px;
  padding: 5px 0px;
}
.tableStyle td {
  font-size: 13px;
  padding: 5px;
}
</style>

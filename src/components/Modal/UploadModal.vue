<template>
  <v-dialog v-model="statusModal" persistent max-width="1000" max-height="1000">
    <v-card class="modalStyle">
      <div class="modalHeader">
        <!-- <v-list-item-icon>
          <v-icon x-large>mdi-video-plus</v-icon>
        </v-list-item-icon> -->
        <h2 v-if="!uploaded">Video upload</h2>
        <h2 v-else>Video Details</h2>

        <v-btn @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text v-if="!uploaded">
        <div class="fileInputStyle">
          <ValidationProvider
            v-slot="{ errors }"
            ref="providerFileInput"
            class="formStyle"
            name="동영상"
            rules="required-select|size:5000000"
          >
            <v-file-input
              v-model="selectedFile"
              dense
              hide-details
              accept="video/mp4"
              prepend-icon="mdi-video"
              :error-messages="errors"
              @change="selectedUploadFile"
            ></v-file-input>
          </ValidationProvider>
          <!-- <v-btn
            type="submit"
            depressed
            class="blue darken-3 flat white--text mt-4"
            @click="$refs.fileInput.$refs.input.click()"
          >
            upload
          </v-btn> -->
        </div>
      </v-card-text>

      <v-card-text v-else>
        <ValidationObserver v-slot="{ handleSubmit, invalid, validate }">
          <v-form class="formStyle" @submit.prevent="handleSubmit(saveVideo)">
            <!-- 썸네일 -->
            <ValidationProvider
              v-slot="{ errors }"
              ref="providerFileInput"
              name="Thumbnail"
              rules="required-select|size:5000000"
            >
              <v-file-input
                v-model="selectedImgFile"
                placeholder="Please upload the thumbnail"
                dense
                hide-details
                accept="image/*"
                prepend-icon="mdi-image"
                icon-size="x-large"
                :error-messages="errors"
                @change="selectedUploadFile"
              ></v-file-input>
            </ValidationProvider>

            <!-- 제목 입력 -->
            <div>
              <ValidationProvider v-slot="{ errors }" name="title" rules="required|max:50">
                <v-text-field
                  v-model="formData.title"
                  label="title"
                  type="text"
                  hide-details="auto"
                  :error-messages="errors"
                ></v-text-field>
                <!-- rules="required|max:20" -->
              </ValidationProvider>
            </div>
            <br />
            <!-- 설명란 -->
            <div>
              <ValidationProvider v-slot="{ errors }" name="description" rules="required">
                <v-textarea
                  v-model="formData.description"
                  :error-messages="errors"
                  outlined
                  label="Description"
                  placeholder="please enter the description"
                >
                  <!-- name="input-7-4" -->
                </v-textarea>
              </ValidationProvider>
            </div>

            <div>
              <ValidationProvider v-slot="{ errors }" name="categories" rules="required">
                <v-select
                  v-model="formData.categories"
                  :error-messages="errors"
                  :items="categoriesTitles"
                  label="Standard"
                  dense
                ></v-select>
              </ValidationProvider>
            </div>

            <div>
              <ValidationProvider v-slot="{ errors }" name="visibility" rules="required">
                <!-- 공개 여부 선택 check box -->

                <v-checkbox
                  v-model="formData.visibility"
                  name="visibility"
                  :label="`Public video?`"
                  :error-messages="errors"
                >
                </v-checkbox>

                <!-- <v-checkbox name="childCheck" :label="`For child?`"></v-checkbox> -->
                <!-- v-model="checkbox" -->
              </ValidationProvider>
            </div>

            <v-btn
              type="submit"
              depressed
              :disabled="invalid == true && validate !== true"
              class="grey darken-1 flat white--text"
              >upload
            </v-btn>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Validate from '@/mixins/Validate.vue'
import axios from 'axios'

export default {
  name: 'UploadModal',
  mixins: [Validate],
  props: {
    openDialog: Boolean
  },
  data: () => ({
    categories: [],
    categoriesTitles: [],
    thumbnail: [],
    selectedFile: [],
    selectedImgFile: [],
    visibility: ['Public', 'Private'],
    formData: {
      id: '',
      title: '',
      description: '',
      category: '',
      visibility: ''
    },
    url: '',
    imgDataUrl: '',

    categoryLoading: false,
    uploading: false,
    uploaded: false,
    saveLoading: false
  }),

  computed: {
    statusModal(props) {
      return props.openDialog
    }
  },
  mounted() {
    this.getCategories()
  },

  methods: {
    closeModal() {
      this.$emit('closeDialog')
    },
    async selectedUploadFile(e) {
      console.log('---- selectedUploadFile : ', this.selectedFile)
      const { valid } = await this.$refs.providerFileInput.validate(e)
      console.log(`selectedUploadFile = valid : ${valid}`)
      if (!valid) return

      // form 데이터 생성
      const videoFormData = new FormData()
      videoFormData.append('video', this.selectedFile, this.selectedFile.name)
      // append(name, value, filename)

      // form 데이터 확인, 반복문으로 찍어서 확인
      for (let item of videoFormData.entries()) {
        console.log(item)
      }

      // draft 비디오 업로드
      await axios
        .post(process.env.VUE_APP_API + '/videos', videoFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          // 폼 데이터 설정
          this.formData.id = response.data.data.id
          this.formData.title = response.data.data.title
          this.formData.description = response.data.data.description
          this.formData.category = response.data.data.category
          this.formData.visibility = response.data.data.visibility
          this.url = `${process.env.VUE_APP_API}/videos/${response.data.data.id}`
          console.log('selectedUploadFile - response: ', response)
          console.log('여기를 체크', response)
          console.log('여기 여기 formData', this.formData)
        })
        .catch(error => {
          console.log('selectedUploadFile - error : ', error)
        })
        .finally(() => {
          // 업로딩 완료 상태
          this.uploaded = true
          this.uploading = false
        })
    },
    async videoDetail() {
      // if (this.loading) return
      // this.loading = true
      // const axiosBody = {
      //   email: this.email,
      //   channelName: this.channelName,
      //   password: this.password
      // }
      // console.log('auth/register - axiosBody : ', axiosBody)
      // await axios
      //   .post(process.env.VUE_APP_URL + '/api/v1/auth/register', axiosBody)
      //   .then(async response => {
      //     console.log('auth/register - response : ', response)
      //     localStorage.setItem('token', response.data.token)
      //   })
      //   .catch(error => {
      //     console.error(error)
      //   })
    },
    // const FormDataFormat = (key, file, fileName) => {
    //   const newFormData = new FormData();
    //   newFormData.append(key, file, fileName);
    //   return newFormData;
    // },
    async saveVideo() {
      // const axiosBody = this.formData
      this.saveLoading = true

      const photoFormData = new FormData()
      photoFormData.append('thumbnail', this.selectedImgFile, this.selectedImgFile.name)
      // process.env.VUE_APP_URL/uploads/avatars/(required_url)

      // FormDataFormat('thumbnail', this.selectedImgFile, this.selectedImgFile)

      for (let item of photoFormData.entries()) {
        console.log(item)
      }

      // 썸네일
      await axios
        .put(`${process.env.VUE_APP_API}/videos/${this.formData.id}/thumbnails`, photoFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('submitData - response : ', response)
          // localStorage.setItem('USER', JSON.stringify(response.data))
          // console.log(`axiosBody: ${axiosBody}`, axiosBody)
        })
        .catch(error => {
          console.log('submitData - error : ', error)
        })

      // 비디오
      await axios
        .put(`${process.env.VUE_APP_API}/videos/${this.formData.id}`, axiosBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('submitData - response : ', response)
          // localStorage.setItem('USER', JSON.stringify(response.data))
          console.log('submitData - response: ', response)
        })
        .catch(error => {
          console.log('submitData - error : ', error)
        })
      const categoryId = this.categories.find(category => {
        if (category.title === this.formData.category) return true
      }).id

      const visibility = this.formData.visibility === true ? 'public' : 'private'
      const axiosBody = {
        title: this.formData.title,
        description: this.formData.description,
        category: categoryId,
        status: visibility.toLowerCase()
      }
      console.log(`saveVideo - axiosBody : `, axiosBody)

      const videoFormData = new FormData()
      videoFormData.append('title', this.formData.title)
      videoFormData.append('description', this.formData.description)
      videoFormData.append('categoryId', categoryId)
      videoFormData.append('status', visibility.toLowerCase())

      for (let item of videoFormData.entries()) {
        console.log(item)
      }
    },
    async getCategories() {
      this.categoryLoading = true
      await axios
        .get(`${process.env.VUE_APP_API}/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('submitData - response : ', response)
          this.categories = response.data.data
          this.categoriesTitles = response.data.data.map(title => {
            return title.title
          })
        })
        .catch(error => {
          console.log('submitData - error : ', error)
        })
    }
  }
}
</script>

<style>
.modalStyle {
  box-sizing: border-box;
  padding: 20px 30px;
}
.modalHeader {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
}
.formStyle {
  margin: 20px auto 0px auto;
}
.fileInputStyle {
  margin: 20px auto 0px auto;
}
.asd {
  width: 70%;
}
</style>

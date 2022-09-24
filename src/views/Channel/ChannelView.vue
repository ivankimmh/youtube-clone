<template>
  <div></div>
</template>

<script>
export default {
  name: 'ChannelView',
  data: () => ({}),
  computed: {
    userId() {
      return this.$router.currentRoute.params.id
    }
  },
  mounted: {
    getUserData() {}
  },
  methods: {
    async getUserData() {}
  }
}
</script>

<style lang="scss" scoped></style>

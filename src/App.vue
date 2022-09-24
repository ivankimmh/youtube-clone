<template>
  <v-app>
    <router-view name="NavBar"></router-view>
    <router-view name="NavBarStudio"></router-view>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>

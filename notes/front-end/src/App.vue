<template>
  <div id="app">
    <div id="nav">
      <button @click="logout">Logout</button>
    </div>
    <router-view/>
  </div>


</template>

<script>
import router from '@/router'
import axios from 'axios'
export default {

  computed: {
    user() {
      return this.$root.$data.user;
    }
  },

  methods: {
  async logout() {
    try {
      await axios.delete("/api/users");
      this.$root.$data.user = null;
      router.push('/');
    } catch (error) {
      this.$root.$data.user = null;
  }
},
  }


}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

button {
  background-color: white;
  border: white;
}

html {
  height: 100%;
}

body {
  height: 100%;
  background-color: #BEBEBE;
}

#nav {
  padding: 30px;
  text-align: right;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

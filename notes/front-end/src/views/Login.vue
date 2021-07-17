<template>
<div class="hero">
  <div class="heroBox">
<div class="login">
    <form class="pure-form space-above">
      <fieldset>
        <legend>Login</legend>
        <div class="button">
        <div class="register-name">
        <input placeholder="username" v-model="usernameLogin">
        <input type="password" placeholder="password" v-model="passwordLogin">
        </div>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
        </div>
      </fieldset>

    </form>
    <p v-if="errorLogin" class="error">{{errorLogin}}</p>

    </div>

<h1> Welcome to <i>Your Notes</i> </h1>

    <div class="register">
    <form class="pure-form space-below">
      <fieldset>
        <legend>Register for an account</legend>
        <div class="button">
        <div class="register-name">
        <input placeholder="first name" v-model="firstName">
        <input placeholder="last name" v-model="lastName">
        <br>
        <br>
        <input placeholder="username" v-model="username">
        <input type="password" placeholder="password" v-model="password">
        </div>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
        </div>
      </fieldset>

    </form>
    <p v-if="error" class="error">{{error}}</p>
  </div>
  </div>
</div>
</template>



<script>
import axios from 'axios';
import router from "../router"
export default {
  name: 'HomePage',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      error: '',
      errorLogin: '',
    }
  },
  methods: {
  async register() {
    this.error = '';
    this.errorLogin = '';
    if (!this.firstName || !this.lastName || !this.username || !this.password)
      return;
    try {
      let response = await axios.post('/api/users', {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
      });
      this.$root.$data.user = response.data.user;
      router.push('/folder');
    } catch (error) {
      this.error = error.response.data.message;
      this.$root.$data.user = null;
    }
  },
  async login() {
  this.error = '';
  this.errorLogin = '';
  if (!this.usernameLogin || !this.passwordLogin)
    return;
  try {
    let response = await axios.post('/api/users/login', {
      username: this.usernameLogin,
      password: this.passwordLogin,
    });
    this.$root.$data.user = response.data.user;
    router.push('/folder');
  } catch (error) {
    this.errorLogin = "Error: " + error.response.data.message;
    this.$root.$data.user = null;
  }

},

}

}
</script>

<style scoped>
.space-above {
  margin-top: 0px;
}


.button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;

}


body {
  height: 100%;
  width: 100%;
  background-color: #808080;
}
.register {


}

legend {
  color: white;
}

fieldset {
  border-color: white;
}

h1 {
  font-size: 28px;
  font-variant: capitalize;
  color: white;
}

.hero {
  padding: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 70%;
}

.heroBox {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

}

.hero form {
  font-size: 14px;
}

.hero form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

.error {
  margin-top: 10px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}
</style>

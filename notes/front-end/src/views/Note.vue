
<template>
  <div v-if="note">
  <div class="note">
    <h1>{{note.name}}</h1>
    <textarea class="newNote"  cols="80" rows="30" v-model="note.contents" placeholder="Contents:"></textarea>
    <button @click="addContents">Submit</button>
  </div>
  </div>
</template>



<script>
import router from "../router"
import axios from "axios"
import moment from 'moment'
export default {

data() {
  return {
    note: null,
  }
},

async created() {
 try {
   let response = await axios.get('/api/users');
   this.$root.$data.user = response.data.user;
 } catch (error) {
   this.$root.$data.user = null;
   router.push('/');
 }
 await this.getNote();
},

    methods: {

      formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 1)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },

    async getNote() {
      try {
        const response = await axios.get('/api/folders/'+this.$route.params.folderid+'/notes/'+this.$route.params.id);
        this.note = response.data;

      } catch(error) {
        console.log(error);
      }

      },
      async addContents() {
        try {
          await axios.put('/api/notes/'+this.$route.params.id, {
            name: this.note.name,
            contents: this.note.contents,
          });
          await axios.put('/api/folders/'+this.$route.params.folderid+'/updateLastEdited');
        } catch(error) {
          console.log(error);
        }
        router.push("/folder/"+this.$route.params.folderid)
      },
    }

  }

</script>


<style scoped>

.newNote {
  height: 400px;
  size: 500;
  justify-content: flex-start;
  background-color: #BEBEBE;
  border: 1px solid white;
 }

 h1 {
   color: white;
 }


</style>

<template>
<div v-if="folder">
  <div class="list">
  <router-link to="/folder">All Folders</router-link>
    <h1>{{folder.name}}</h1>

    <input v-model="addedNote" placeholder="New note name">
    <button @click="addNote()">Enter</button>
    <div class="notes">
      <div class="row" v-for="note in notes" :key="note.id">
       <button @click="deleteNote(folder._id, note._id)">Delete Note</button>
        <span><router-link :to="{name:'Notes',params:{folderid:folder._id,id:note._id}}">{{note.name}}</router-link> </span>
        <span> - edited {{formatDate(note.date)}}</span>

      </div>
    </div>
    </div>

  </div>
</template>


<script>

import router from "../router"
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'NoteList',
  data() {
    return {
      addedNote: "",
      notes: [],
      folder: null,
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
   await this.getFolder();
   await this.getNotes();
 },
  methods: {

  formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 1)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },

    async getFolder() {
      try {
        const response = await axios.get('/api/folders/'+this.$route.params.id);
        this.folder = response.data;

      } catch(error) {
        console.log(error);
      }
    },
    async getNotes() {
      try {
        const response = await axios.get(`/api/folders/`+this.$route.params.id+`/notes`);
        this.notes = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addNote() {
      try {
        let res = await axios.post(`/api/folders/`+this.$route.params.id+`/notes`, {
          name: this.addedNote,
          contents: "",
        } );
        await axios.put('/api/folders/'+this.$route.params.id+'/updateLastEdited');
        await this.getNotes();
        router.push("/folder/"+this.$route.params.id+"/note/"+res.data._id)
      } catch (error) {
        console.log(error);
      }
    },

    async deleteNote(folderID,noteID) {
      try {
        await axios.delete(`/api/folders/`+folderID+`/notes/`+noteID);
        this.getNotes(noteID);
      } catch (error) {
        console.log(error);
      }
    },
  },

}
</script>


<style scoped>

.folder {
  width: 100%;

}


button {
  background-color: white;
  border: grey;
}

span {
  color: white;

}
h1 {
  color: white;
}
.notes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 65%;
  margin: auto;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-top: 5px;
  border: 2px solid white;
}


</style>

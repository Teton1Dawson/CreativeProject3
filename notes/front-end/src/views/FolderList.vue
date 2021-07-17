<template>

  <div class="folder">

    <h1>Folders</h1>

    <input v-model="addedFolder" placeholder="New folder name">
    <button @click="addFolder">Enter</button>
    <div class="folders">
      <div class="row" v-for="folder in folders" :key="folder.id">

        <button @click="deleteFolder(folder._id)">Delete Folder</button>

        <span><router-link :to="{name:'NoteList',params:{id:folder._id}}">{{folder.name}}</router-link> </span>
        <span> - <i>edited</i> {{formatDate(folder.date)}}</span>

      </div>
    </div>

  </div>
</template>

<script>

import router from "../router"
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'Folder',
  data() {
    return {
      addedFolder: ""
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
   await this.getFolders(this.$root.$data.user._id);
 },


  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 1)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },

    async addFolder() {
      if(this.addedFolder !== "") {
        try {
          let res = await axios.post("/api/folders", {
          name: this.addedFolder,
        });
        await this.getFolders(this.$root.$data.user._id);
        this.addedFolder = "";
        router.push("/folder/"+res.data._id)
          } catch (error) {
             console.log(error);
          }
      }

    },

    async getFolders(userID) {
      try {
      console.log(userID);
        const response = await axios.get("/api/folders/user/"+userID);
        this.$root.$data.folders = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteFolder(id) {
      try {
        await axios.delete(`/api/folders/`+id);
        await this.getFolders(this.$root.$data.user._id);
      } catch (error) {
        console.log(error);
      }
    }
  },

  computed: {
    folders() {
      return this.$root.$data.folders;
    }

  }
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
.folders {
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

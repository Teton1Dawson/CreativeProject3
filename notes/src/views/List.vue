<template>
  <div class="list">

    <h1> My Notes </h1>

    <input v-model="addedNote" placeholder="New note name">
    <button @click="addNote">Enter</button>
    <div class="notes">
      <div class="row" v-for="note in notes" :key="note.id">
        <span><router-link :to="{name:'Notes',params:{id:note.id}}">{{note.name}}</router-link> </span>
        <button @click="deleteNote(note.id)">Delete Note</button>
      </div>
    </div>

  </div>
</template>


<script>

import router from "../router"
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'list',
  data() {
    return {
      addedNote: ""
    }
  },


  methods: {
    addNote() {
      if(this.addedNote !== "") {
        let id = uuidv4()

        this.$root.$data.notes.push({name:this.addedNote, id:id})
        this.addedNote = "";
        router.push("/note/"+id)

      }


    },

    deleteNote(id) {
      let notes = this.$root.$data.notes

      for(let i = 0; i < notes.length; i++) {
          if(notes[i].id === id) {
              notes.splice(i,1)
          }
      }
    }
  },

  computed: {
    notes() {
      return this.$root.$data.notes;
    }





  }
}
</script>


<style scoped>

.row {

  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width:20%;

}

.notes {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;

}


</style>

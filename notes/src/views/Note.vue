
<template>
  <div class="note">
    <h1>{{note.name}}</h1>
    <textarea class="newNote"  cols="80" rows="30" v-model="note.contents" placeholder="Contents:"></textarea>
    <button @click="addContents">Submit</button>
  </div>
</template>



<script>
import router from "../router"
export default {


data() {
  return {
    note: null,
  }
},

  created() {

      let id=this.$route.params.id

      for(let i = 0; i < this.$root.$data.notes.length; i++) {
          if(this.$root.$data.notes[i].id === id) {
            this.note = this.$root.$data.notes[i]
            }
          }
    },

    methods: {

      addContents() {
        router.push("/")
      },
    }

  }

</script>


<style scoped>

.newNote {
  height: 400px;
  size: 500;
  justify-content: flex-start;
 }


</style>

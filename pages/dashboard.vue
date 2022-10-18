<template>
  <v-container class="mt-0">
    <div class="d-flex justify-center">
      
      <v-container>
        <v-row>
          <v-col><h2 class="accent--text">Welcome to TMS</h2></v-col>
        </v-row>
        <dashboard-basic-information/>
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  auth:true,
});
<script setup>
import PostList from '@/components/PostList.vue'
import { useUserStore } from '@/stores/UserStore'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
  edit: { type: Boolean, default: false }
})

const { authUser } = storeToRefs(useUserStore())
</script>

<template>
  <div class="container">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <user-profile-card v-if="!props.edit" :user="authUser" />
        <user-profile-card-editor v-else :user="authUser" />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ authUser.username }}'s recent activity </span>
          <a href="#">See only started threads?</a>
        </div>

        <hr />

        <post-list :posts="authUser.posts" />
        <!--<div class="activity-list">
          <div class="activity">
            <div class="activity-header">
              <img src="https://i.imgur.com/OqlZN48.jpg" alt="" class="hide-mobile avatar-small" />
              <p class="title">
                How can I chop onions without crying?
                <span>Joker started a topic in Cooking</span>
              </p>
            </div>

            <div class="post-content">
              <div>
                <p>
                  I absolutely love onions, but they hurt my eyes! Is there a way where you can chop
                  onions without crying?
                </p>
              </div>
            </div>

            <div class="thread-details">
              <span>4 minutes ago</span>
              <span>1 comments</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>

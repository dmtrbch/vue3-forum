<script setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
import { computed } from 'vue'
import { findById } from '@/helpers/index.js'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

const props = defineProps({
  timestamp: { type: [Number, Object], required: true }
})

const diffForHumans = computed(() => dayjs.unix(normalizedTimestamp.value).fromNow())
const humanFriendlyDate = computed(() => dayjs.unix(normalizedTimestamp.value).format('llll'))
const normalizedTimestamp = computed(() => props.timestamp?.seconds || props.timestamp)
</script>

<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<style scoped></style>

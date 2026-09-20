<script setup lang="ts">
import type { TodoSort } from '@/types/Todo'

const sortBy = defineModel<TodoSort>('sortBy', { required: true })
const hideCompleted = defineModel<boolean>('hideCompleted', { required: true })
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <label class="form-control w-52">
      <span class="label-text mb-2">Sort to-dos</span>
      <select v-model="sortBy" class="select select-bordered">
        <option value="createdDate">Newest first</option>
        <option value="todoType">To-do type</option>
        <option value="status">Status</option>
      </select>
    </label>

    <label class="label cursor-pointer gap-3">
      <span class="label-text">Hide completed</span>
      <input v-model="hideCompleted" type="checkbox" class="checkbox checkbox-primary" />
    </label>
  </div>
</template>

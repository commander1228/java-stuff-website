<script setup lang="ts">
import type { TodoSort } from '@/types/Todo'
import type { TodoType } from '@/types/TodoType'

const sortBy = defineModel<TodoSort>('sortBy', { required: true })
const hideCompleted = defineModel<boolean>('hideCompleted', { required: true })
const todoTypeId = defineModel<number | undefined>('todoTypeId', { required: true })

defineProps<{
  todoTypes: TodoType[]
}>()
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

    <label class="form-control w-52">
      <span class="label-text mb-2">Filter by type</span>
      <select v-model="todoTypeId" class="select select-bordered">
        <option :value="undefined">All types</option>
        <option v-for="todoType in todoTypes" :key="todoType.id" :value="todoType.id">
          {{ todoType.name }}
        </option>
      </select>
    </label>

    <label class="label cursor-pointer gap-3">
      <span class="label-text">Hide completed</span>
      <input v-model="hideCompleted" type="checkbox" class="checkbox checkbox-primary" />
    </label>
  </div>
</template>

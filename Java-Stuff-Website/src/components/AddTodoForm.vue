<script setup lang="ts">
import { reactive } from 'vue'
import type { CreateTodo, Todo } from '@/types/Todo'
import type { TodoType } from '@/types/TodoType'
import { createTodo } from '@/services/TodoService'

const emptyTodo = reactive<CreateTodo>({
  title: '',
  description: '',
})

const emit = defineEmits<{
  (event: 'added', todo: Todo): void
}>()

defineProps<{
  todoTypes: TodoType[]
}>()

async function handleSubmit() {
  const todoToCreate: CreateTodo = {
    title: emptyTodo.title.trim(),
    description: emptyTodo.description.trim(),
    todoTypeId: emptyTodo.todoTypeId,
  }
  const createdTodo = await createTodo(todoToCreate)
  emptyTodo.title = ''
  emptyTodo.description = ''
  emptyTodo.todoTypeId = undefined
  emit('added', createdTodo)
}

</script>

<template>
  <div class="card w-96 bg-base-100 shadow-sm">
    <form class="card-body" @submit.prevent="handleSubmit">
      <input
        v-model="emptyTodo.title"
        type="text"
        placeholder="Title"
        class="input input-bordered w-full"
        required
      />
      <input
        v-model="emptyTodo.description"
        type="text"
        placeholder="Description"
        class="input input-bordered w-full"
      />
      <select v-model="emptyTodo.todoTypeId" class="select select-bordered w-full">
        <option :value="undefined">No type</option>
        <option v-for="todoType in todoTypes" :key="todoType.id" :value="todoType.id">
          {{ todoType.name }}
        </option>
      </select>
      <button class="btn btn-primary" type="submit">
        Add Todo
      </button>
    </form>
  </div>
</template>
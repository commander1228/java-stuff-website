<script setup lang="ts">
import { onMounted,ref } from 'vue'
import AddTodoForm from '@/components/AddTodoForm.vue'
import TodoItems from '@/components/TodoItems.vue'
import type { Todo } from '@/types/Todo'
import { getTodos } from '@/services/TodoService'

const todos = ref<Todo[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

async function loadTodos() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    todos.value = await getTodos()
  }catch (error) {
    errorMessage.value = 
    error instanceof Error ? error.message : 'Unable to load to-dos'
  } finally {
    isLoading.value = false
  }
}
</script>


<template>
  <section class="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col px-6 py-8">
    <h1 class="text-center text-3xl font-bold text-primary">To-Do</h1>
    <div class="mt-6">
      <AddTodoForm />
    </div>

    <TodoItems class="mt-8" :todos="todos" />
  </section>
</template>
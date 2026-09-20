<script setup lang="ts">
import TodoItem from '@/components/TodoItem.vue'
import type { Todo, TodoStatus } from '@/types/Todo'

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  (event: 'edit', todo: Todo): void
  (event: 'delete', id: Todo['id']): void
  (event: 'change-status', todo: Todo, status: TodoStatus): void
}>()

function handleStatusChange(todo: Todo, status: TodoStatus) {
  emit('change-status', todo, status)
}
</script>

<template>
  <section>
    <h2 class="mb-3 text-xl font-semibold">Todo's</h2>

    <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <p v-if="todos.length === 0" class="text-base-content/60">
          No tasks yet.
        </p>

        <ul v-else>
          <li v-for="todo in todos" :key="todo.id" class="mb-3 last:mb-0">
            <TodoItem
              :todo="todo"
              @edit="emit('edit', $event)"
              @delete="emit('delete', $event)"
              @change-status="handleStatusChange"
            />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
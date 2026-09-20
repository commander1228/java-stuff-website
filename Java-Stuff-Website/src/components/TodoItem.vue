<script setup lang="ts">
import {
  Todo_STATUS,
  Todo_STATUS_LABELS,
  type Todo,
  type TodoStatus,
} from '@/types/Todo'

defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (event: 'edit', todo: Todo): void
  (event: 'delete', id: Todo['id']): void
  (event: 'change-status', todo: Todo, status: TodoStatus): void
}>()
</script>

<template>
  <article class="card border border-base-300 bg-base-200">
    <div class="card-body p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="card-title text-lg">{{ todo.title }}</h3>
          <p class="mt-1 text-base-content/70">
            {{ todo.description }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="badge badge-outline">
            {{ Todo_STATUS_LABELS[todo.status] }}
          </span>

          <div class="dropdown dropdown-end">
            <button
              class="btn btn-ghost btn-sm"
              type="button"
              tabindex="0"
              aria-label="To-do actions"
            >
              Actions
            </button>

            <ul
              class="menu dropdown-content z-10 mt-2 w-52 rounded-box bg-base-100 p-2 shadow"
              tabindex="0"
            >
              <li>
                <button type="button" @click="emit('edit', todo)">
                  Edit
                </button>
              </li>

              <li>
                <button
                  class="text-error"
                  type="button"
                  @click="emit('delete', todo.id)"
                >
                  Delete
                </button>
              </li>

              <li class="menu-title">
                <span>Change status</span>
              </li>

              <li v-for="status in Todo_STATUS" :key="status">
                <button
                  type="button"
                  :disabled="status === todo.status"
                  @click="emit('change-status', todo, status)"
                >
                  {{ Todo_STATUS_LABELS[status] }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

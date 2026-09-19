<script setup lang="ts">
import { Todo_STATUS_LABELS, type Todo } from '@/types/Todo'

defineProps<{
  todos: Todo[]
}>()
</script>

<template>
  <section class="min-h-0 flex-1">
    <h2 class="mb-3 text-xl font-semibold">Tasks</h2>

    <div class="card h-full bg-base-100 shadow-sm">
      <div class="card-body min-h-0">
        <p v-if="todos.length === 0" class="text-base-content/60">
          No tasks yet.
        </p>

        <ul v-else class="overflow-y-auto pr-2">
          <li v-for="todo in todos" :key="todo.id" class="mb-3 last:mb-0">
            <article class="card border border-base-300 bg-base-200">
              <div class="card-body p-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="card-title text-lg">{{ todo.title }}</h3>
                    <p class="mt-1 text-base-content/70">
                      {{ todo.description }}
                    </p>
                  </div>

                  <span class="badge badge-outline">
                    {{ Todo_STATUS_LABELS[todo.status] }}
                  </span>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
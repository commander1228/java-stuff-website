<script setup lang="ts">
import { nextTick, ref } from 'vue'
import {
  Todo_STATUS,
  Todo_STATUS_LABELS,
  type Todo,
  type TodoStatus,
} from '@/types/Todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (event: 'edit', todo: Todo): void
  (event: 'delete', id: Todo['id']): void
  (event: 'change-status', todo: Todo, status: TodoStatus): void
}>()

const isActionsOpen = ref(false)
const menuPosition = ref({ top: 0, left: 0 })
const actionMenu = ref<HTMLElement | null>(null)

async function openActions(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement
  const bounds = button.getBoundingClientRect()

  menuPosition.value = {
    top: bounds.bottom + 8,
    left: Math.max(8, bounds.right - 208),
  }
  isActionsOpen.value = true

  await nextTick()

  const menuBounds = actionMenu.value?.getBoundingClientRect()

  if (menuBounds && menuBounds.bottom > window.innerHeight - 8) {
    menuPosition.value.top = Math.max(8, bounds.top - menuBounds.height - 8)
  }
}

function closeActions() {
  isActionsOpen.value = false
}

function handleEdit() {
  emit('edit', props.todo)
  closeActions()
}

function handleDelete() {
  emit('delete', props.todo.id)
  closeActions()
}

function handleStatusChange(status: TodoStatus) {
  emit('change-status', props.todo, status)
  closeActions()
}
</script>

<template>
  <article class="card border border-base-300 bg-base-200">
    <div class="card-body p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="card-title text-lg">{{ props.todo.title }}</h3>
          <p class="mt-1 text-base-content/70">
            {{ props.todo.description }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="badge badge-outline">
            {{ Todo_STATUS_LABELS[props.todo.status] }}
          </span>

          <button
            class="btn btn-ghost btn-sm"
            type="button"
            aria-haspopup="menu"
            :aria-expanded="isActionsOpen"
            @click="openActions"
          >
            Actions
          </button>
        </div>
      </div>
    </div>
  </article>

  <Teleport to="body">
    <button
      v-if="isActionsOpen"
      class="fixed inset-0 z-40 cursor-default"
      type="button"
      aria-label="Close to-do actions"
      @click="closeActions"
    />

    <ul
      v-if="isActionsOpen"
      ref="actionMenu"
      class="menu fixed z-50 w-52 rounded-box bg-base-100 p-2 shadow"
      role="menu"
      :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }"
      @keydown.esc="closeActions"
    >
      <li>
        <button type="button" @click="handleEdit">Edit</button>
      </li>

      <li>
        <button class="text-error" type="button" @click="handleDelete">
          Delete
        </button>
      </li>

      <li class="menu-title">
        <span>Change status</span>
      </li>

      <li v-for="status in Todo_STATUS" :key="status">
        <button
          type="button"
          :disabled="status === props.todo.status"
          @click="handleStatusChange(status)"
        >
          {{ Todo_STATUS_LABELS[status] }}
        </button>
      </li>
    </ul>
  </Teleport>
</template>

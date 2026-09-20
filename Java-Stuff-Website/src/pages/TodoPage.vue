<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddTodoForm from '@/components/AddTodoForm.vue'
import TodoItems from '@/components/TodoItems.vue'
import type { Todo, TodoStatus } from '@/types/Todo'
import { deleteTodo, getTodos, updateTodo } from '@/services/TodoService'

const todos = ref<Todo[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const editDialog = ref<HTMLDialogElement | null>(null)
const editingTodo = ref<Todo | null>(null)
const editTitle = ref('')
const editDescription = ref('')
const isSavingEdit = ref(false)

async function loadTodos() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    todos.value = await getTodos()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load to-dos'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadTodos)

function handleEdit(todo: Todo) {
  editingTodo.value = todo
  editTitle.value = todo.title
  editDescription.value = todo.description
  editDialog.value?.showModal()
}

async function handleDelete(id: Todo['id']) {
  errorMessage.value = ''

  try {
    await deleteTodo(id)
    await loadTodos()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to delete the to-do.'
  }
}

async function handleStatusChange(todo: Todo, status: TodoStatus) {
  errorMessage.value = ''

  try {
    const updatedTodo = await updateTodo(todo.id, {
      ...todo,
      status,
    })

    todos.value = todos.value.map((item) =>
      item.id === updatedTodo.id ? updatedTodo : item,
    )
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to update the to-do.'
  }
}

async function handleEditSubmit() {
  if (!editingTodo.value) {
    return
  }

  isSavingEdit.value = true
  errorMessage.value = ''

  try {
    const updatedTodo = await updateTodo(editingTodo.value.id, {
      ...editingTodo.value,
      title: editTitle.value.trim(),
      description: editDescription.value.trim(),
    })

    todos.value = todos.value.map((item) =>
      item.id === updatedTodo.id ? updatedTodo : item,
    )
    editDialog.value?.close()
    editingTodo.value = null
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to update the to-do.'
  } finally {
    isSavingEdit.value = false
  }
}
</script>


<template>
  <section class="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col px-6 py-8">
    <h1 class="text-center text-3xl font-bold text-primary">To-Do</h1>
    <div class="mt-6">
      <AddTodoForm />
    </div>

    <p v-if="isLoading" class="mt-8">Loading to-dos...</p>

    <p v-else-if="errorMessage" class="mt-8 text-error" role="alert">
      {{ errorMessage }}
    </p>

    <TodoItems
      v-else
      class="mt-8"
      :todos="todos"
      @edit="handleEdit"
      @delete="handleDelete"
      @change-status="handleStatusChange"
    />

    <dialog ref="editDialog" class="modal">
      <div class="modal-box">
        <h2 class="text-lg font-bold">Edit To-Do</h2>

        <form class="mt-4 grid gap-4" @submit.prevent="handleEditSubmit">
          <input
            v-model="editTitle"
            class="input input-bordered w-full"
            placeholder="Title"
            required
          />

          <textarea
            v-model="editDescription"
            class="textarea textarea-bordered w-full"
            placeholder="Description"
            required
          />

          <div class="modal-action">
            <button
              class="btn"
              type="button"
              :disabled="isSavingEdit"
              @click="editDialog?.close()"
            >
              Cancel
            </button>
            <button class="btn btn-primary" type="submit" :disabled="isSavingEdit">
              {{ isSavingEdit ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button aria-label="Close edit dialog">close</button>
      </form>
    </dialog>
  </section>
</template>
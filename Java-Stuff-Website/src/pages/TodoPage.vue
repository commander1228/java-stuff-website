<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AddTodoForm from '@/components/AddTodoForm.vue'
import TodoItems from '@/components/TodoItems.vue'
import type { Todo, TodoStatus } from '@/types/Todo'
import type { TodoType } from '@/types/TodoType'
import { deleteTodo, getTodos, updateTodo } from '@/services/TodoService'
import { createTodoType, getTodoTypes } from '@/services/TodoTypeService'

const todos = ref<Todo[]>([])
const todoTypes = ref<TodoType[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const editDialog = ref<HTMLDialogElement | null>(null)
const todoTypeDialog = ref<HTMLDialogElement | null>(null)
const editingTodo = ref<Todo | null>(null)
const editTitle = ref('')
const editDescription = ref('')
const editTodoTypeId = ref<number | undefined>()
const isSavingEdit = ref(false)
const todoTypeName = ref('')
const isSavingTodoType = ref(false)
const sortBy = ref<'createdDate' | 'todoType'>('createdDate')

const sortedTodos = computed(() => {
  return [...todos.value].sort((first, second) => {
    if (sortBy.value === 'todoType') {
      const firstTypeName = first.todoType?.name
      const secondTypeName = second.todoType?.name

      if (!firstTypeName) {
        return secondTypeName ? 1 : 0
      }

      if (!secondTypeName) {
        return -1
      }

      return firstTypeName.localeCompare(secondTypeName)
    }

    return second.createdDate.localeCompare(first.createdDate)
  })
})

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

async function loadTodoTypes() {
  try {
    todoTypes.value = await getTodoTypes()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load to-do types.'
  }
}

onMounted(() => {
  loadTodos()
  loadTodoTypes()
})

function handleEdit(todo: Todo) {
  editingTodo.value = todo
  editTitle.value = todo.title
  editDescription.value = todo.description
  editTodoTypeId.value = todo.todoType?.id
  editDialog.value?.showModal()
}

async function handleDelete(id: Todo['id']) {
  errorMessage.value = ''

  try {
    await deleteTodo(id)
    todos.value = todos.value.filter((todo) => todo.id !== id)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to delete the to-do.'
  }
}

function handleAdded(todo: Todo) {
  todos.value.push(todo)
  successMessage.value = `"${todo.title}" was added.`

  window.setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

async function handleTodoTypeSubmit() {
  const name = todoTypeName.value.trim()

  if (!name) {
    return
  }

  isSavingTodoType.value = true
  errorMessage.value = ''

  try {
    const todoType = await createTodoType({ name })

    todoTypes.value.push(todoType)
    todoTypeName.value = ''
    todoTypeDialog.value?.close()
    successMessage.value = `"${todoType.name}" was added as a to-do type.`

    window.setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to add the to-do type.'
  } finally {
    isSavingTodoType.value = false
  }
}

async function handleStatusChange(todo: Todo, status: TodoStatus) {
  errorMessage.value = ''

  try {
    const updatedTodo = await updateTodo(todo.id, {
      title: todo.title,
      description: todo.description,
      status,
      todoTypeId: todo.todoType?.id,
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
      title: editTitle.value.trim(),
      description: editDescription.value.trim(),
      status: editingTodo.value.status,
      todoTypeId: editTodoTypeId.value,
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
  <section class="mx-auto max-w-4xl px-6 py-8">
    <h1 class="text-center text-3xl font-bold text-primary">To-Do</h1>
    <div class="mt-6 flex flex-wrap items-start gap-4">
      <AddTodoForm :todo-types="todoTypes" @added="handleAdded" />
      <button class="btn btn-secondary" type="button" @click="todoTypeDialog?.showModal()">
        Add To-Do Type
      </button>
    </div>

    <p v-if="isLoading" class="mt-8">Loading to-dos...</p>

    <p v-else-if="errorMessage" class="mt-8 text-error" role="alert">
      {{ errorMessage }}
    </p>

    <div v-else class="mt-8">
      <label class="form-control ml-auto w-52">
        <span class="label-text mb-2">Sort to-dos</span>
        <select v-model="sortBy" class="select select-bordered">
          <option value="createdDate">Newest first</option>
          <option value="todoType">To-do type</option>
        </select>
      </label>

      <TodoItems
        class="mt-4"
        :todos="sortedTodos"
        @edit="handleEdit"
        @delete="handleDelete"
        @change-status="handleStatusChange"
      />
    </div>

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
          />

          <select v-model="editTodoTypeId" class="select select-bordered w-full">
            <option :value="undefined">No type</option>
            <option v-for="todoType in todoTypes" :key="todoType.id" :value="todoType.id">
              {{ todoType.name }}
            </option>
          </select>

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

    <dialog ref="todoTypeDialog" class="modal">
      <div class="modal-box">
        <h2 class="text-lg font-bold">Add To-Do Type</h2>

        <form class="mt-4 grid gap-4" @submit.prevent="handleTodoTypeSubmit">
          <input
            v-model="todoTypeName"
            class="input input-bordered w-full"
            placeholder="Type name"
            required
          />

          <div class="modal-action">
            <button
              class="btn"
              type="button"
              :disabled="isSavingTodoType"
              @click="todoTypeDialog?.close()"
            >
              Cancel
            </button>
            <button class="btn btn-primary" type="submit" :disabled="isSavingTodoType">
              {{ isSavingTodoType ? 'Adding...' : 'Add Type' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button aria-label="Close to-do type dialog">close</button>
      </form>
    </dialog>

    <div v-if="successMessage" class="toast toast-end toast-bottom">
      <div class="alert alert-success">
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </section>
</template>
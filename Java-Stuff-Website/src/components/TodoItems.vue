<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from '@/components/TodoItem.vue'
import { Todo_STATUS, type Todo, type TodoSort, type TodoStatus } from '@/types/Todo'

const props = defineProps<{
  todos: Todo[]
  sortBy: TodoSort
  todoTypeId?: number
  hideCompleted: boolean
}>()

const emit = defineEmits<{
  (event: 'edit', todo: Todo): void
  (event: 'delete', id: Todo['id']): void
  (event: 'change-status', todo: Todo, status: TodoStatus): void
}>()

function handleStatusChange(todo: Todo, status: TodoStatus) {
  emit('change-status', todo, status)
}

const displayedTodos = computed(() => {
  const typeFilteredTodos =
    props.todoTypeId === undefined
      ? props.todos
      : props.todos.filter((todo) => todo.todoType?.id === props.todoTypeId)

  const visibleTodos = props.hideCompleted
    ? typeFilteredTodos.filter((todo) => todo.status !== 'COMPLETED')
    : typeFilteredTodos

  return [...visibleTodos].sort((first, second) => {
    if (props.sortBy === 'todoType') {
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

    if (props.sortBy === 'status') {
      return Todo_STATUS.indexOf(first.status) - Todo_STATUS.indexOf(second.status)
    }

    return second.createdDate.localeCompare(first.createdDate)
  })
})
</script>

<template>
  <section>
    <h2 class="mb-3 text-xl font-semibold">Todo's</h2>

    <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <p v-if="displayedTodos.length === 0" class="text-base-content/60">
          No tasks yet.
        </p>

        <ul v-else>
          <li v-for="todo in displayedTodos" :key="todo.id" class="mb-3 last:mb-0">
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
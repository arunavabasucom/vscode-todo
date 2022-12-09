<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { apiBaseUrl } from "../../src/constants";
  /*props*/
  export let user: User;
  export let authToken: any;
  /*types*/
  type todos = {
    id: number;
    text: string;
    completed: boolean;
  };
  /*types*/

  /*variables*/
  let todos: todos[] = [];
  let text: string = "";
  /*variables*/

  /*adding todo*/
  async function addTodo(t: string) {
    const response = await fetch(`${apiBaseUrl}/todo`, {
      method: "POST",
      body: JSON.stringify({
        text: t,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${authToken}`,
      },
    });
    const { todo } = await response.json();
    todos = [todo, ...todos];
  }

  /*getting todos*/
  async function getTodo() {
    const response = await fetch(`${apiBaseUrl}/todo`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${authToken}`,
      },
    });
    const payload = await response.json();
    todos = payload.todos;
  }

  /*on mount*/
  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "new-todo" /*getting the message from the selection*/:
          addTodo(message.value);
          break;
      }
    });
    getTodo();
  });
</script>

<div>Hello: {user.name}</div>

<form
  on:submit|preventDefault={async () => {
    addTodo(text);
    text = "";
  }}
>
  <input bind:value={text} />
</form>
{#each todos as { text, completed, id } (id)}
  <ul>
    <li
      class:completed
      on:click={async () => {
        completed = !completed;
        const response = await fetch(`${apiBaseUrl}/todo`, {
          method: "PUT",
          body: JSON.stringify({
            id: id,
          }),
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${authToken}`,
          },
        });
        await response.json();
      }}
    >
      {text}
    </li>
  </ul>
{/each}

<style>
  .completed {
    text-decoration: line-through;
  }
</style>

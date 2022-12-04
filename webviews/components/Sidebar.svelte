<script lang="ts">
  import { onMount } from "svelte";

  type todos = {
    text: string;
    completed: boolean;
  };

  let todos: todos[] = [];
  let text: string = "";
  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;

      switch (message.type) {
        case "new-todo" /*getting the message from the selection*/:
          todos = [{ text: message.value, completed: false }, ...todos];
          break;
      }
    });
  });
</script>

<form
  on:submit|preventDefault={() => {
    todos = [{ text, completed: false }, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>

<!-- /*for getting raw output*/
<pre>
    {JSON.stringify(todos,null,2)}
</pre> -->
<!-- class={completed ? "completed" : ""} -->

{#each todos as { text, completed } (text)}
  <ul>
    <li
      class:completed
      on:click={() => {
        completed = !completed;
      }}
    >
      {text}
    </li>
  </ul>
{/each}

<button
  on:click={() => {
    ts_vscode.postMessage({ type: "onInfo", value: "Success" });
  }}
  >Success
</button>
<button
  on:click={() => {
    ts_vscode.postMessage({ type: "onError", value: "Error" });
  }}>Error</button
>

<style>
  .completed {
    text-decoration: line-through;
  }
</style>

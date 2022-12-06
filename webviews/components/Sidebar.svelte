<script lang="ts">
  import { onMount } from "svelte";

  type todos = {
    text: string;
    completed: boolean;
  };

  let todos: todos[] = [];
  let text: string = "";
  let loading: boolean = true;
  let user: { name: string; id: number } | null = null;
  onMount(async () => {
    window.addEventListener("message", (event) => {
      const message = event.data;

      switch (message.type) {
        case "new-todo" /*getting the message from the selection*/:
          todos = [{ text: message.value, completed: false }, ...todos];
          break;
      }
    });
    const response = await fetch(`http://localhost:3002/me`,{
      headers:{
          authorization: `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    user = data.user;
    loading = false;
  });
</script>

{#if loading}
  <div>loading</div>
{:else if user}
  <pre>
  {JSON.stringify(user,null,2)}
</pre>
{:else}
  <div>no user is logged in</div>
{/if}

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

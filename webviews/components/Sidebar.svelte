<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { apiBaseUrl } from "../../src/constants";
  /*component imports */
  import Todos from "./Todos.svelte";

  /*types*/
  type todos = {
    text: string;
    completed: boolean;
  };

  /*variables*/
  let text: string = "";
  let loading: boolean = true;
  let user: User | null = null;
  let authToken: string = "";


  onMount(async () => {
    window.addEventListener("message", async (event) => {
      const message = event.data;
      switch (message.type) {
        case "token":
          authToken = message.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              authorization: `Bearer ${authToken}`,
            },
          });
          const data = await response.json();
          user = data.user;
          loading = false;
      }
    });
    ts_vscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

{#if loading}
  <div>loading</div>
{:else if user}
  <Todos {user} {authToken} />
  <button
    on:click={() => {
      authToken = "";
      user = null;
      ts_vscode.postMessage({ type: "logout", value: undefined });
    }}>Logout</button
  >
{:else}
  <button
    on:click={() => {
      ts_vscode.postMessage({ type: "authenticate", value: undefined });
    }}>Log in with Github</button
  >
{/if}

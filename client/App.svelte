<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import CPlay from "./components/Play.svelte";
    import CRoom from "./components/Room.svelte";
    import CUsername from "./components/Username.svelte";
    import { Page, Username } from "./store/index.js";

    const Pages = {
        play: { component: CPlay },
        room: { component: CRoom },
        username: { component: CUsername }
    };

    onMount(() => !$Username && load());

    async function load() {
        const { data } = await axios.get("/account/username-get");
        $Username = data?.username || "";

        if (!$Username) {
            $Page = "username";
        } else {
            $Page = "room";
        }
    }
</script>

{#each Object.entries(Pages) as [key, { component }]}
    <svelte:component this={component} show={key === $Page} />
{/each}

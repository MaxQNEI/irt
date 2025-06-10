<script>
    import axios from "axios";
    import { Page, Username } from "../store/index.js";

    export let show = false;

    const MIN = 3;
    const MAX = 16;

    let allow = false;

    $: {
        $Username = $Username
            ?.trim()
            ?.replace(/[^\w\d]+/g, "")
            ?.replace(/^\d+/, "")
            .slice(0, MAX);

        allow = !isNaN($Username?.length) && $Username?.length >= MIN && $Username?.length <= MAX;
    }

    async function onsubmit(event) {
        event.preventDefault();

        const { data } = await axios.post("/account/username-set", { username: $Username }).catch((e) => {
            if (e.response.status === 400) {
                return { data: e.response.data };
            } else {
                throw new Error(e);
            }
        });

        if (data.ok) {
            $Page = "room";
        } else if (data.error) {
            console.warn("Error", data.error);
        } else {
            console.warn("Data", data);
        }
    }
</script>

<div class="block-username" class:show>
    <form class="block-content" action="#" {onsubmit}>
        <input bind:value={$Username} type="text" name="username" placeholder="Username" />
        <button type="submit" disabled={!allow}>Continue</button>
    </form>
</div>

<style>
    input {
        width: 320px;
    }

    .block-username {
        position: fixed;
        top: 0;
        left: 0;
        width: 100dvw;
        height: 100dvh;

        display: grid;
        justify-content: center;
        align-content: center;

        transition: all 300ms ease;
    }

    .block-content {
        display: grid;
        grid-gap: 8px;
        padding: 20px;
        background-color: rgba(120, 120, 120, 0.5);
        text-align: center;
    }

    .block-username:not(.show) {
        pointer-events: none;
        opacity: 0;
        transform: scale(0.9);
        transform-origin: center;
    }
</style>

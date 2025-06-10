<script>
    import { Room } from "../store/index.js";

    export let show = false;

    const MIN = 3;
    const MAX = 16;

    let allow = false;

    $: {
        $Room = $Room
            ?.trim()
            ?.replace(/[^\w\d]+/g, "")
            ?.replace(/^\d+/, "")
            .slice(0, MAX);

        allow = !isNaN($Room?.length) && $Room?.length >= MIN && $Room?.length <= MAX;
    }

    async function onsubmit(event) {
        event.preventDefault();

        const { data } = await axios.post("/room/enter", { room: $Room }).catch((e) => {
            if (e.response.status === 400) {
                return { data: e.response.data };
            } else {
                throw new Error(e);
            }
        });

        if (data.ok) {
            $Page = "play";
        } else if (data.error) {
            console.warn("Error", data.error);
        } else {
            console.warn("Data", data);
        }
    }
</script>

<div class="block-room" class:show>
    <form class="block-content" action="#" {onsubmit}>
        <input bind:value={$Room} type="text" name="username" placeholder="Room" />
        <button type="submit" disabled={!allow}>Enter / Create</button>
    </form>
</div>

<style>
    input {
        width: 320px;
    }

    .block-room {
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

    .block-room:not(.show) {
        pointer-events: none;
        opacity: 0;
        transform: scale(0.9);
        transform-origin: center;
    }
</style>

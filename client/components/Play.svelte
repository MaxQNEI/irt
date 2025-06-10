<script>
    import { Username } from "../store/index.js";

    export let show = false;
</script>

<div class="block-play" class:show>
    <div class="play">
        <h1>Play</h1>
        <h3>Username: {$Username}</h3>
    </div>
</div>

<style>
    .block-play {
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

    .play {
        display: grid;
        grid-gap: 8px;
        padding: 20px;
        background-color: rgba(120, 120, 120, 0.5);
        text-align: center;
    }

    .block-play:not(.show) {
        pointer-events: none;
        opacity: 0;
        transform: scale(0.9);
        transform-origin: center;
    }
</style>

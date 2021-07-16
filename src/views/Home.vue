<template>
    <div class="home">
        <input type="file" @change="setVideo($event)">

        <div v-if="videoFile">
            <video :src="videoFile" width="250" controls></video>
            <button @click="convertToGif">Convert to gif</button>
        </div>

        <div v-if="gif">
            <h3>Result</h3>
            <img :src="gif" alt="" width="250">
        </div>
    </div>
</template>

<script>
// @ is an alias to /src ... so can't use @ffmpeg without absolute path?
import { createFFmpeg, fetchFile } from "../../node_modules/@ffmpeg/ffmpeg";

export default {
    name: "Home",
    data: function () {
        return {
            ffmpeg: null,
            videoFile: null,
            gif: null,
        };
    },
    created() {
        this.ffmpeg = createFFmpeg({
            log: true,
        });
        // Initialise loadFFmpeg
        this.loadFFmpeg();
    },
    methods: {
        async loadFFmpeg() {
            await this.ffmpeg.load();
        },
        setVideo(e) {
            if (e.target.files.length > 0) {
                this.videoFile = URL.createObjectURL(e.target.files?.item(0));
            }
        },
        async convertToGif() {
            // Write file to memory
            this.ffmpeg.FS("writeFile", "inputFile.mp4", await fetchFile(this.videoFile));

            // Run the FFMpeg command
            // i = input file, t = length of output, -ss (starting seconds) offset, -f = encode as ...
            await this.ffmpeg.run("-i", "inputFile.mp4", "-t", "2.5", "-ss", "2.0", "-f", "gif", "outputFile.gif");

            // Read the result
            const data = this.ffmpeg.FS("readFile", "outputFile.gif");

            // Create a URL
            const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));

            // Update data value
            this.gif = url;
        },
    },
};
</script>

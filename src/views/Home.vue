<template>
    <div class="home">
        <input type="file" @change="setVideo($event)">

        <div v-if="videoFile">
            <video :src="videoFile" width="250" controls></video>
            <button @click="convertToGif">Convert to gif</button>
            <button @click="encodeCropped">Encode cropped</button>
        </div>

        <div v-if="gif">
            <h3>Result</h3>
            <img :src="gif" alt="" width="250">
        </div>

        <div v-if="croppedVideo">
            <h3>Cropped video result</h3>
            <video :src="croppedVideo" width="250" controls></video>
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
            croppedVideo: null,
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
        async encodeCropped() {
            // Write file to memory
            this.ffmpeg.FS("writeFile", "input.mp4", await fetchFile(this.videoFile));

            // Templates:

            // Blurred background - crops video to a rectangle and makes abckground blurred version of the video.
            var blurred = ["-i", "input.mp4", "-c:v", "libx264", "-filter_complex", "[0:v]crop=610:1080:960:0[croppedbg];[croppedbg]scale=720:1280,boxblur=10[background];[0:v]crop=1345:755:288:162[croppedgf];[croppedgf]scale=720:-2[gameplay];[background][gameplay]overlay=y=(H-h)/2", "-c:a", "copy", "output.mp4"];

            // Split - Puts the face cam video on top
            var split = ["-i", "input.mp4", "-c:v", "libx264", "-filter_complex", "[0:v]crop=385:216:448:252[croppedfc];[croppedfc]scale=720:-2[top];[0:v]crop=591:720:344:0[croppedgf];[croppedgf]scale=720:-2[bottom];[top][bottom]vstack", "-c:a", "copy", "output.mp4"];

            await this.ffmpeg.run(...blurred);

            // Read the result
            const data = this.ffmpeg.FS("readFile", "output.mp4");

            // Create a URL
            const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

            // Update data value
            this.croppedVideo = url;
        },
    },
};
</script>

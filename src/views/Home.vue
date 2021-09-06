<template>
    <div class="home">
        <input type="file" @change="setVideo($event)">

        <!-- Video editor -->
        <div class="editor-wrapper">
            <video ref="videoSrcEl" :src="videoSrcFile" controls></video>

            <vue-cropper id="cropWrapper" :style="{maxHeight: cropWrapperHeight + 'px'}" v-if="imageSrc" ref="cropper" :src="imageSrc" alt="Source Image" :viewMode="3" :aspectRatio="1">
            </vue-cropper>

            <!-- Canvas used for cropper reference -->
            <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
        </div>

        <button @click="encodeCropped">Encode cropped</button>

        <div v-if="croppedVideo">
            <h3>Cropped video result</h3>
            <video :src="croppedVideo" width="250" controls></video>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src ... so can't use @ffmpeg without absolute path?
import { createFFmpeg, fetchFile } from "../../node_modules/@ffmpeg/ffmpeg";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
    name: "Home",
    components: {
        VueCropper,
    },
    data: function () {
        return {
            ffmpeg: null,
            videoSrcFile: null,
            gif: null,
            croppedVideo: null,
            imageSrc: null,
            canvasWidth: null,
            canvasHeight: null,
        };
    },
    computed: {
        cropWrapperHeight() {
            return this.$refs.videoSrcEl.getBoundingClientRect().height;
        },
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
                // set video url and load video
                this.videoSrcFile = URL.createObjectURL(e.target.files?.item(0));

                // Creating a 'fake' image and loading into the crop component
                setTimeout(() => {
                    // grab the intrinsic size of the video and set the canvas to that size
                    this.canvasWidth = this.$refs.videoSrcEl.videoWidth;
                    this.canvasHeight = this.$refs.videoSrcEl.videoHeight;

                    document.getElementById("canvas").width = "1920";
                    document.getElementById("canvas").height = "1080";

                    // Convert the canvas to  base64 image
                    var dataURL = document.getElementById("canvas").toDataURL("image/png");
                    // set the cropper.js iamge source to this image
                    this.imageSrc = dataURL;
                }, 1000);
            }
        },
        async encodeCropped() {
            var cropper = this.$refs.cropper;

            var cropperData = cropper.getData(!0);
            console.log(cropperData);

            // Write file to memory
            this.ffmpeg.FS("writeFile", "input.mp4", await fetchFile(this.videoSrcFile));
            var n = this.$refs.videoSrcEl.videoHeight;
            var a = this.$refs.videoSrcEl.videoWidth;
            var r = Math.round(n / 1.77);
            var s = Math.round(a / 2);

            // Templates:

            // Blurred background - crops video to a rectangle and makes abckground blurred version of the video.
            // crop=output_w:output_h:x:y
            var blurred = [
                "-i",
                "input.mp4",
                "-c:v",
                "libx264",
                "-filter_complex",
                "[0:v]crop=".concat(r, ":").concat(n, ":").concat(s, ":0[croppedbg];[croppedbg]scale=720:1280,boxblur=10[background];[0:v]crop=").concat(cropperData.width, ":").concat(cropperData.height, ":").concat(cropperData.x, ":").concat(cropperData.y, "[croppedgf];[croppedgf]scale=720:-2[gameplay];[background][gameplay]overlay=y=(H-h)/2"),
                "-c:a",
                "copy",
                "output.mp4",
            ];

            // // Split - Puts the face cam video on top
            // var split = ["-i", "input.mp4", "-c:v", "libx264", "-filter_complex", "[0:v]crop=385:216:448:252[croppedfc];[croppedfc]scale=720:-2[top];[0:v]crop=591:720:344:0[croppedgf];[croppedgf]scale=720:-2[bottom];[top][bottom]vstack", "-c:a", "copy", "output.mp4"];

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
<style lang="scss" scoped>
.home {
    height: 100%;
}

.editor-wrapper {
    width: 800px;
    margin: 0 auto;
    position: relative;
    padding: 0;
    video {
        position: absolute;
        width: 100%;
        inset: 0px;
    }

    #cropWrapper::v-deep {
        position: absolute;
        width: 100%;
        inset: 0px;
        .cropper-container {
            height: 100%;
        }

        .cropper-bg {
            background-image: none !important;
        }
    }
}
</style>

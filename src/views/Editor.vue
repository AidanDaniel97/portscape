<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-form>
                    <v-file-input v-model="videoSrcFile" label="Upload your video" outlined dense></v-file-input>
                    <v-btn v-if="videoSrcFile" @click="encodeCropped" :loading="loading">Crop video</v-btn>
                </v-form>
            </v-col>
            <v-col>

                <!-- Video cropper component -->
                <VideoCropper v-if="videoSrcFile" :videoFile="videoSrcFile" />

                <div v-if="croppedVideo">
                    <h3>Cropped video result</h3>
                    <video :src="croppedVideo" width="250" controls></video>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "cropperjs/dist/cropper.css";
import { mapGetters } from "vuex";
import VideoCropper from "@/components/editor/VideoCropper";

export default {
    name: "Editor",
    components: {
        VideoCropper,
    },
    data: function () {
        return {
            ffmpeg: null,
            videoSrcFile: null,
            croppedVideo: null,
        };
    },
    computed: {
        ...mapGetters({
            loading: "app/loading",
            cropper: "videoCropper/cropper",
            videoFile: "videoCropper/videoFile",
        }),
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
        async encodeCropped() {
            // Set loading state
            this.$store.dispatch("app/setLoading", true);
            // // Get the crop data
            var cropperData = this.cropper.getData(!0);
            console.log(this.cropperData);

            // Write file to memory
            this.ffmpeg.FS("writeFile", "input.mp4", await fetchFile(this.videoFile.file));
            var n = this.videoFile.height;
            var a = this.videoFile.width;
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

            this.$store.dispatch("app/setLoading", false);
        },
    },
};
</script>

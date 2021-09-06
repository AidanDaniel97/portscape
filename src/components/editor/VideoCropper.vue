<template>
    <div class="editor-wrapper">
        <!-- Video that plays -->
        <video ref="videoSrcEl" :src="videoSrcURL" controls></video>

        <!-- Vue cropper shows on top of video -->
        <vue-cropper id="cropWrapper" :style="{maxHeight: cropWrapperHeight + 'px'}" v-if="imageSrc" ref="cropper" :src="imageSrc" alt="Source Image" :viewMode="3">
        </vue-cropper>

        <!-- Canvas used for cropper reference -->
        <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { mapGetters } from "vuex";

export default {
    name: "VideoCropper",
    props: {
        videoFile: {
            type: File,
            required: true,
        },
    },
    components: {
        VueCropper,
    },
    data: function () {
        return {
            croppedVideo: null,
            imageSrc: null,
            canvasWidth: null,
            canvasHeight: null,
        };
    },
    computed: {
        ...mapGetters({
            loading: "app/loading",
            cropper: "videoCropper/cropper",
        }),
        cropWrapperHeight() {
            return this.$refs.videoSrcEl.getBoundingClientRect().height;
        },
        videoSrcURL() {
            return this.videoFile ? URL.createObjectURL(this.videoFile) : null;
        },
    },
    mounted() {
        setTimeout(() => {
            // Set video dimensions
            let videoFile = {
                file: this.videoFile,
                width: this.$refs.videoSrcEl.videoWidth,
                height: this.$refs.videoSrcEl.videoHeight,
            };
            this.$store.dispatch("videoCropper/setVideoFile", videoFile);

            // grab the intrinsic size of the video and set the canvas to that size
            this.canvasWidth = videoFile.width;
            this.canvasHeight = videoFile.height;
            document.getElementById("canvas").width = this.canvasWidth;
            document.getElementById("canvas").height = this.canvasHeight;
            // Convert the canvas to  base64 image
            let dataURL = document.getElementById("canvas").toDataURL("image/png");
            // set the cropper.js image source to this image
            this.imageSrc = dataURL;

            // Save cropper to state
            this.$nextTick(() => {
                this.$store.dispatch("videoCropper/setCropper", this.$refs.cropper);
            });
        }, 500);
    },
    methods: {
        async loadFFmpeg() {
            await this.ffmpeg.load();
        },
    },
};
</script>

<style lang="scss" scoped>
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

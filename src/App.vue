<template>
    <div id="app">
        <v-app>
            <!-- App bar -->
            <v-container fluid>
                <v-app-bar dense elevation="0" color="white" app>
                    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                    <v-toolbar-title> {{$route.name}}</v-toolbar-title>
                </v-app-bar>
            </v-container>

            <!-- Navigation drawer -->
            <v-navigation-drawer class="gradient-bg-purple-blue pt-0" width="325px" v-model="drawer" app>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="d-flex justify-center">
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list>
                    <v-list-item :to="{ name: 'Home' }">
                        <v-list-item-action class="mr-3">
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item :to="{ name: 'Editor' }">
                        <v-list-item-action class="mr-3">
                            <v-icon>mdi-tools</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Editor</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pl-5 pr-0" link @click="drawer = false">
                        <v-list-item-action class="mr-3">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Hide navigation</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <!-- Main app -->
            <v-main>
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </v-main>

        </v-app>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drawer: true,
        };
    },
};
</script>

<style lang="scss">
html,
body {
    height: 100%;
    margin: 0px;
    padding: 0px;
}
</style>

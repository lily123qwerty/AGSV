<template>
    <q-layout view="hHh lpR fFf">
        <q-header class="bg-primary text-white" height-hint="98">
            <q-toolbar>
                <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

                <q-toolbar-title>
                    <q-avatar>
                        <img
                            src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
                        />
                    </q-avatar>
                    AGSV
                    <q-btn-dropdown color="secondary" label="New shape">
                        <q-list>
                            <q-item
                                clickable
                                v-close-popup
                                @click="medium = true"
                            >
                                <q-item-section>
                                    <q-item-label>Triangle</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="onItemClick"
                            >
                                <q-item-section>
                                    <q-item-label>Circle</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="onItemClick"
                            >
                                <q-item-section>
                                    <q-item-label>parallelogram</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="onItemClick"
                            >
                                <q-item-section>
                                    <q-item-label>Trapezium</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="onItemClick"
                            >
                                <q-item-section>
                                    <q-item-label>Regular Polygon</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>

                    <q-dialog v-model="medium">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-card-section>
                                <div class="text-h6">Medium</div>
                            </q-card-section>

                            <q-card-section class="q-pt-none">
                                Click/Tap on the backdrop.
                            </q-card-section>

                            <q-card-actions
                                align="right"
                                class="bg-white text-teal"
                            >
                                <q-btn flat label="OK" v-close-popup />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
                </q-toolbar-title>

                <q-btn
                    dense
                    flat
                    round
                    icon="menu"
                    @click="toggleRightDrawer"
                />
            </q-toolbar>

            <!-- <q-tabs align="left">
                <q-route-tab to="/page1" label="Page One" />
                <q-route-tab to="/page2" label="Page Two" />
                <q-route-tab to="/page3" label="Page Three" />
            </q-tabs> -->
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
            <!-- drawer content -->
            <div class="q-pa-md q-gutter-sm">
                <q-tree
                    :nodes="simple"
                    node-key="label"
                    no-connectors
                    v-model:expanded="expanded"
                />
            </div>
        </q-drawer>

        <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
            <!-- drawer content -->
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(true);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value;
}

const expanded = ref([
    'Satisfied customers (with avatar)',
    'Good food (with icon)',
]);

const simple = [
    {
        label: 'Satisfied customers (with avatar)',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        children: [
            {
                label: 'Good food (with icon)',
                icon: 'restaurant_menu',
                children: [
                    { label: 'Quality ingredients' },
                    { label: 'Good recipe' },
                ],
            },
            {
                label: 'Good service (disabled node with icon)',
                icon: 'room_service',
                disabled: true,
                children: [
                    { label: 'Prompt attention' },
                    { label: 'Professional waiter' },
                ],
            },
            {
                label: 'Pleasant surroundings (with icon)',
                icon: 'photo',
                children: [
                    {
                        label: 'Happy atmosphere (with image)',
                        img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png',
                    },
                    { label: 'Good table presentation' },
                    { label: 'Pleasing decor' },
                ],
            },
        ],
    },
];

const medium = ref(false);
</script>

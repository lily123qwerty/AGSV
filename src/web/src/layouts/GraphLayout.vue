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
                    <q-btn-dropdown
                        class="q-ml-lg"
                        color="secondary"
                        label="New shape"
                    >
                        <q-list>
                            <q-item
                                clickable
                                v-close-popup
                                @click="showAddTriangle = true"
                            >
                                <q-item-section>
                                    <q-item-label>Triangle</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="showAddCircle = true"
                            >
                                <q-item-section>
                                    <q-item-label>Circle</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="showAddParallelogram = true"
                            >
                                <q-item-section>
                                    <q-item-label>parallelogram</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="showAddTrapezium = true"
                            >
                                <q-item-section>
                                    <q-item-label>Trapezium</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                                v-close-popup
                                @click="showAddPolygon = true"
                            >
                                <q-item-section>
                                    <q-item-label>Regular Polygon</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                    <q-btn
                        class="q-ml-sm"
                        color="secondary"
                        label="test"
                        @click="test"
                    />
                    <q-btn
                        class="q-ml-sm"
                        square
                        color="secondary"
                        icon="home"
                    />
                    <q-btn
                        class="q-ml-sm"
                        square
                        color="secondary"
                        icon="save"
                    />

                    <!-- pop ups for creating new shape -->
                    <q-dialog v-model="showAddTriangle">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-card-section>
                                <div class="text-h6">add triangle</div>
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

                    <q-dialog v-model="showAddCircle">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-card-section>
                                <div class="text-h6">add circle</div>
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

                    <q-dialog v-model="showAddParallelogram">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-card-section>
                                <div class="text-h6">add parallelogram</div>
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

                    <q-dialog v-model="showAddTrapezium">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-card-section>
                                <div class="text-h6">add trapezium</div>
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

                    <q-dialog v-model="showAddPolygon">
                        <q-card style="width: 700px; max-width: 80vw">
                            <q-card-section>
                                <div class="text-h6">add regular polygon</div>
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

        <q-drawer v-model="leftDrawerOpen" side="left" bordered>
            <!-- drawer content -->
            <div class="q-pa-md q-gutter-sm">
                <q-tree
                    :nodes="allShape"
                    node-key="label"
                    no-connectors
                    v-model:expanded="expanded"
                />
            </div>
            <div class="q-pa-md">
                <q-badge color="secondary">
                    variable1: {{ standard }} (0 to 50)
                </q-badge>

                <q-slider
                    v-model="standard"
                    :min="0"
                    :max="50"
                    label
                    label-always
                    color="blue"
                />
            </div>
        </q-drawer>

        <q-drawer v-model="rightDrawerOpen" side="right" bordered>
            <!-- drawer content -->
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import Graph from '../model/Graph';

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value;
}
function test() {
    console.log('test');
    let g = new Graph();
    let t = g.addTriangleBy2Angle1Side(40, 105, 100);
    g.addTriangleBy2Angle1Side(45, 45, t.edges[2], 1);
    console.log(g.toJSON());
}

const expanded = ref(['all Shapes', 'all Variables']);

const allShape = [
    {
        label: 'all Shapes',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        children: [
            {
                label: 'Triangle',
                icon: 'restaurant_menu',
                children: [
                    { label: 'Quality ingredients' },
                    { label: 'Good recipe' },
                ],
            },
            {
                label: 'Circle',
                icon: 'room_service',
                //disabled: true,
                children: [
                    { label: 'Prompt attention' },
                    { label: 'Professional waiter' },
                ],
            },
            {
                label: 'parallelogram',
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
            {
                label: 'trapezium',
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
            {
                label: 'regular polygon',
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

let standard = ref(2);

//pop up control
const showAddTriangle = ref(false);
const showAddCircle = ref(false);
const showAddParallelogram = ref(false);
const showAddTrapezium = ref(false);
const showAddPolygon = ref(false);
</script>

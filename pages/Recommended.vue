<template>
    <div class="w-full h-auto bg-[#000000] flex flex-col p-5 items-center">
        <h1 class="font-bold text-[#ffffff] text-2xl mb-[30px] mt-[30px]">Recommanded</h1>
        <div class="gap-4 py-6 px-2 w-[95%] flex flex-nowrap overflow-x-auto custom-scrollbar justify-self-center">
            <div v-for="item in items" :key="item.id"
                class="hover:scale-110 transition-transform duration-300 cursor-pointer shrink-0">
                <img :src="item.image" class="w-35 h-55 object-cover" />
                <h2 class="text-lg font-bold">{{ item.title }}</h2>
                <p class="text-gray-400">{{ item.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: "login" });
import { ref } from 'vue';


const items = [
    {
        id: 1,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 2,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 3,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 4,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 5,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 6,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 7,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 8,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 9,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
    {
        id: 10,
        title: "ธรรมชาติภูเขา",
        description: "",
        image: "/img/luca.png",
    },
];



</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
    height: 8px;
    /* ความสูง scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    /* สี track (bg-gray-200) */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #505050;
    /* สี thumb (bg-gray-400) */
    border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #818181;
    /* สี hover */
}
</style>

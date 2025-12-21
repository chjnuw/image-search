<template>
    <div class="w-full h-auto mt-25 flex">
        <div class="flex flex-col items-center w-[40%] h-auto bg-[#000000] p-10">
            <div class="flex flex-col gap-6 justify-center items-center">
                <h1 class="font-extrabold text-4xl underline">Type of Movie</h1>

                <div class="grid grid-cols-2 gap-3.5 w-[500px] mt-5 place-items-center">
                    <button v-for="tag in tags" :key="tag" @click="toggleTag(tag)" :class="[
                        'w-[156px] h-[43px] rounded-[70px] font-bold shadow-2xl cursor-pointer text-[#000000] text-shadow-4xl transition',
                        selectedTags.includes(tag)
                            ? 'bg-[#A0E13E]'
                            : 'bg-[#ffffff] hover:bg-[#A0E13E]'
                    ]">
                        {{ tag }}
                    </button>
                </div>
            </div>
            <button
                class="w-40 h-[43px] rounded-[70px] font-bold cursor-pointer text-[#ffffff] bg-[#a0e13e] mt-9 text-shadow-4xl hover:bg-[#78a92f] ">
                Random
            </button>

        </div>
        <div class="w-[60%] h-auto bg-[#0B0A0A] p-5">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-4">
                <div v-for="movie in movies" :key="movie.id"
                    class="w-[150px] h-[225px] bg-gray-200  overflow-hidden shadow-lg">
                    <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover">
                </div>
            </div>

        </div>
    </div>
</template>
<script setup>
const selectedTags = ref([]);
const toggleTag = (tag) => {
    // ถ้าแท็กนี้ถูกเลือกอยู่ → ยกเลิก
    if (selectedTags.value.includes(tag)) {
        selectedTags.value = selectedTags.value.filter(t => t !== tag);
        return;
    }

    // ยังไม่ครบ 3 → เลือกเพิ่มได้
    if (selectedTags.value.length < 3) {
        selectedTags.value.push(tag);
    }
};

const tags = [
    "#Action", "#Horror", "#Sci-Fi",
    "#Adventure", "#Drama", "#Crime",
    "#Romance", "#Thriller", "#Comedy",
    "#Animation", "#Fantasy", "#Documentary"
];

const movies = [
  { id: 1, title: "Movie A", poster: "/img/chanposter.png" },
  { id: 2, title: "Movie B", poster: "/img/chanposter.png" },
  { id: 3, title: "Movie C", poster: "/img/chanposter.png" },
  { id: 4, title: "Movie D", poster: "/img/chanposter.png" },
  { id: 5, title: "Movie E", poster: "/img/chanposter.png" },
];
</script>
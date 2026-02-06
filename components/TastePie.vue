<template>
  <div
    class="mt-20 mx-auto max-w-3xl rounded-3xl bg-gradient-to-b from-[#121212] to-[#0B0A0A] border border-white/10 p-8 shadow-xl"
  >
    <!-- title -->
    <h2 class="text-white text-xl font-semibold text-center mb-1">
      รสนิยมการดูหนังของคุณ
    </h2>
    <p class="text-white/50 text-sm text-center mb-6">
      วิเคราะห์จากหนังที่คุณกด ❤️
    </p>

    <!-- loading -->
    <p v-if="pending" class="text-white/60 text-center py-20">
      ⏳ กำลังประมวลผลรสนิยมของคุณ...
    </p>

    <!-- empty -->
    <p
      v-else-if="!data || data.length === 0"
      class="text-white/60 text-center py-20"
    >
      ยังไม่มีข้อมูลรสนิยม <br />
      <span class="text-xs text-white/40">
        ลองกดเพิ่มหนังในรายการโปรดก่อนนะ 🙂
      </span>
    </p>

    <!-- chart -->
    <ClientOnly>
      <div
        v-show="data?.length"
        class="relative mx-auto h-[360px] max-w-[520px]"
      >
        <canvas ref="canvasRef" />
      </div>
    </ClientOnly>

    <div v-if="topGenres.length" class="text-center mb-4">
      <p class="text-white/60 text-sm mb-2">แนวที่คุณชอบที่สุด</p>

      <div class="flex flex-wrap justify-center gap-3">
        <div
          v-for="g in topGenres"
          :key="g.genre_id"
          @click="goToCategory(g.genre_id, g.genre_name)"
          class="px-4 py-2 rounded-full bg-[#90CB38]/10 border border-[#90CB38]/40 cursor-pointer"
        >
          <p class="text-lg font-bold text-[#90CB38]">
            {{ g.genre_name }}
          </p>
          <p class="text-white/70 text-xs text-center">
            {{ g.percent.toFixed(1) }}%
          </p>
        </div>
      </div>

      <p class="text-xs text-white/50 mt-2">
        คุณชอบแนวนี้มากกว่าผู้ใช้ทั่วไป
        <span class="text-[#90CB38] font-bold"> {{ comparePercent }}% </span>
      </p>
    </div>
    <div v-if="otherTopGenres.length" class="mt-4 text-center">
      <p class="text-white/40 text-xs mb-2">แนวที่คุณชอบรองลงมา</p>
      <div class="flex justify-center gap-2 flex-wrap">
        <span
          v-for="g in otherTopGenres"
          :key="g.genre_id"
          class="px-3 py-1 text-xs rounded-full bg-white/5 text-white/70"
        >
          {{ g.genre_name }} ({{ g.percent.toFixed(0) }}%)
        </span>
      </div>
    </div>
    <p
      v-if="topMood"
      class="text-[#90CB38] font-semibold text-md text-center mt-2"
    >
      คุณคือ {{ topMood }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Chart } from "chart.js/auto";
import { ref, onMounted, watchEffect, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

type TasteScore = {
  genre_id: number;
  genre_name: string;
  score: number;
  avg_score?: number;
};

const moodMap: Record<string, string> = {
  Action: "สายเดือด 🔥",
  Adventure: "สายผจญภัย 🧭",
  Animation: "สายการ์ตูน 🎨",
  Comedy: "สายฮา 😂",
  Crime: "สายอาชญากรรม 🕵️‍♂️",
  Documentary: "สายสารคดี 📽️",
  Drama: "สายอิน 😭",
  Family: "สายอบอุ่น 👨‍👩‍👧‍👦",
  Fantasy: "สายแฟนตาซี 🧙‍♂️",
  History: "สายประวัติศาสตร์ 🏺",
  Horror: "สายหลอน 👻",
  Music: "สายดนตรี 🎵",
  Mystery: "สายลึกลับ 🧩",
  Romance: "สายหวาน 💖",
  Science_Fiction: "สายไซไฟ 🚀",
  TV_Movie: "สายหนังทีวี 📺",
  Thriller: "สายลุ้นระทึก 😱",
  War: "สายสงคราม 💣",
  Western: "สายคาวบอย 🤠",
};

const topMood = computed(() => {
  if (!topGenres.value.length) return null;


  const genreName = topGenres.value[0].genre_name;
  return moodMap[genreName] || "สายดูหนังหลากหลาย 🎬";
});

const otherTopGenres = computed(() => {
  if (!data.value?.length) return [];

  return [...data.value]
    .sort((a, b) => b.score - a.score)
    .slice(1, 3)
    .map((g) => ({
      ...g,
      percent: (g.score / totalScore.value) * 100,
    }));
});

const comparePercent = computed(() => {
  if (!topGenres.value.length) return 0;
  const g = topGenres.value[0];
  if (!g.avg_score) return 0;
  return (((g.score - g.avg_score) / g.avg_score) * 100).toFixed(0);
});

const goToCategory = (genre: { genre_id: number; genre_name: string }) => {
  router.push({
    path: "/catagory",
    query: {},
  });
};

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const { data, pending, refresh } = await useFetch<TasteScore[]>(
  "/api/user/taste/score",
  { credentials: "include" },
);
defineExpose({
  refreshTaste: refresh,
});

const topGenres = computed(() => {
  if (!data.value?.length) return [];

  const maxScore = Math.max(...data.value.map((g) => g.score));

  return data.value
    .filter((g) => g.score === maxScore)
    .map((g) => ({
      ...g,
      percent: (g.score / totalScore.value) * 100,
    }));
});

const totalScore = computed(
  () => data.value?.reduce((sum, g) => sum + g.score, 0) || 0,
);

onMounted(() => {
  watchEffect(() => {
    if (!canvasRef.value) return;
    if (!data.value || data.value.length === 0) return;

    if (chart) chart.destroy();

    chart = new Chart(canvasRef.value, {
      type: "pie",
      data: {
        labels: data.value.map((v) => v.genre_name),
        datasets: [
          {
            data: data.value.map((v) => v.score),
            backgroundColor: [
              "#90CB38",
              "#4ADE80",
              "#22C55E",
              "#16A34A",
              "#15803D",
              "#166534",
              "#60A5FA",
              "#38BDF8",
              "#818CF8",
              "#A78BFA",
              "#F472B6",
              "#FB7185",
            ],
            borderWidth: 2,
            borderColor: "#0B0A0A",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 16,
        },
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#E5E7EB",
              usePointStyle: true,
              pointStyle: "circle",
              padding: 14,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} คะแนน`,
            },
          },
        },
      },
    });
  });
});
</script>

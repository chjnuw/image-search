import { ref } from "vue";
export const mockdata = () => {
  const items = ref([
    {
      id: 1,
      poster: "/img/gbposter.png",
      title: "The Tunnel to Summer, the Exit of Goodbyes (2022)",
      tages: [
        { id: 1, name: "Adventure" },
        { id: 2, name: "Fantasy" },
        { id: 3, name: "Slice of Life" },
        { id: 4, name: "Romance" },
        { id: 5, name: "Drama" },
      ],
      ageRating: "13+",
      time: "1h 50m",
      description:
        "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

      backdrop: [
        "/img/gb.png",
        "/img/chan.png",
        "/img/fri.png",
        "/img/chanposter.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
      ],
      textPosition: "left",
    },
    {
      id: 2,
      poster: "/img/chanposter.png",
      title: "CHANSAW MAN Raze arc",
      tages: [
        { id: 1, name: "Adventure" },
        { id: 2, name: "Fantasy" },
        { id: 3, name: "Slice of Life" },
        { id: 4, name: "Romance" },
        { id: 5, name: "Drama" },
      ],
      ageRating: "13+",
      time: "1h 50m",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

      backdrop: [
        "/img/chan.png",
        "/img/gb.png",
        "/img/fri.png",
        "/img/chanposter.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
      ],
      textPosition: "right",
    },
    {
      id: 3,
      poster: "/img/friposter.png",
      title: "Friren: Beyond Journey's End",
      tages: [
        { id: 1, name: "Adventure" },
        { id: 2, name: "Fantasy" },
        { id: 3, name: "Slice of Life" },
        { id: 4, name: "Romance" },
        { id: 5, name: "Drama" },
      ],
      ageRating: "13+",
      time: "1h 50m",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

      backdrop: [
        "/img/fri.png",
        "/img/gb.png",
        "/img/chan.png",
        "/img/chanposter.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
        "/img/gb.png",
      ],
      textPosition: "left",
    },
  ]);

  const movieTags = ref([
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Animation" },
    { id: 4, name: "Comedy" },
    { id: 5, name: "Drama" },
    { id: 6, name: "Fantasy" },
    { id: 7, name: "Horror" },
    { id: 8, name: "Romance" },
    { id: 9, name: "Sci-Fi" },
    { id: 10, name: "Thriller" },
  ]);

  const actors = [
  { id: 1, name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 2,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 3,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 4,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 5,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 6,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 7,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 8,name: "Jacob Tremblay", profile: "/img/directorex..png" },
  { id: 9,name: "Jacob Tremblay", profile: "/img/directorex..png" },
];
  return { items, movieTags, actors };
};


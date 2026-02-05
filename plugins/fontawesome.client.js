import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// เลือก icon ที่จะใช้ (เพิ่มได้)
import {
  faUser,
  faHome,
  faTrash,
  faEdit,
  faMagnifyingGlass,
  faPlay,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCircleInfo,
  faHeart as faHeartSolid,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faCircleUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faXTwitter,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";

// เพิ่มไอคอนเข้าคลัง
library.add(
  faUser,
  faHome,
  faTrash,
  faEdit,
  faHeartSolid,
  faHeartRegular,
  faFacebook,
  faGithub,
  faMagnifyingGlass,
  faCircleUser,
  faPlay,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCircleInfo,
  faXmark,
  faFacebook,
  faGithub,
  faInstagram,
  faXTwitter,
  faImdb,
);
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("FontAwesomeIcon", FontAwesomeIcon);
});

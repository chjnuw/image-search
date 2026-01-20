export const useLang = () => {
  const lang = useState<"th-TH" | "en-US">("lang", () => "th-TH");
   const region = useState<"TH" | "US">("region", () => "TH");
  return { lang, region };
};
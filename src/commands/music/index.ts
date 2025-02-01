import config from "@/config.js";
import { buildCategory } from "@/utils/builders/buildCategory.js";

export default buildCategory({
    id: "music",
    name: "categories.music.name",
    description: "categories.music.description",
    emoji: config.emojis.cd
});

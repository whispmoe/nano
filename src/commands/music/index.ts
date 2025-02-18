import config from "@/config.js";
import { Category } from "@/classes/category.js";

export default new Category("music", {
    name: "categories.music.name",
    description: "categories.music.description",
    emoji: config.emojis.cd
});

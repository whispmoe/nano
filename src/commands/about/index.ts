import config from "@/config.js";
import { Category } from "@/classes/category.js";

export default new Category("about", {
    name: "categories.about.name",
    description: "categories.about.description",
    emoji: config.emojis.bubble
});

import config from "@/config.js";
import { buildCategory } from "@/utils/builders/buildCategory.js";

export default buildCategory({
    id: "about",
    name: "categories.about.name",
    description: "categories.about.description",
    emoji: config.emojis.bubble
});

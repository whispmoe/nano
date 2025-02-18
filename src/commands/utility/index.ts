import config from "@/config.js";
import { Category } from "@/classes/category.js";

export default new Category("utility", {
    name: "categories.utility.name",
    description: "categories.utility.description",
    emoji: config.emojis.plus
});

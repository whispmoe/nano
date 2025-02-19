import config from "@/config.js";
import { Category } from "@/classes/category.js";

export default new Category("fun", {
    name: "categories.fun.name",
    description: "categories.fun.description",
    emoji: config.emojis.star
});

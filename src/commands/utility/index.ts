import config from "@/config.js";
import { buildCategory } from "@/utils/builders/buildCategory.js";

export default buildCategory({
    id: "utility",
    name: "categories.utility.name",
    description: "categories.utility.description",
    emoji: config.emojis.plus
});

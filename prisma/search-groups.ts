/**
 * Starting search groups for the shake flavor finder. Seeded once; afterwards they're edited in
 * the admin (Menu → Search groups). Members match ingredient words at the start of a word, with
 * plurals ignored ("cherry" matches "cherry syrup" and "maraschino cherries"). A member can name
 * another group (Nuts → Tree nuts, Peanuts) so adding "macadamia" to Tree nuts updates Nuts too.
 *
 * Groups marked CONFIRM are derived from ingredient names only and should be checked with the
 * kitchen before anyone relies on them for allergies.
 */
export type SeedSearchGroup = { name: string; keywords?: string[]; members: string[]; showChip?: boolean };

export const DEFAULT_SEARCH_GROUPS: SeedSearchGroup[] = [
  {
    name: "Fruit",
    keywords: ["fruity"],
    members: ["strawberry", "banana", "blackberry", "blueberry", "raspberry", "cherry", "pineapple", "lime", "lemon", "coconut", "watermelon"],
  },
  { name: "Berries", keywords: ["berry"], members: ["strawberry", "blackberry", "blueberry", "raspberry"] },
  { name: "Citrus", members: ["lime", "lemon"], showChip: false },
  {
    name: "Chocolate",
    keywords: ["choc", "chocolatey"],
    members: ["chocolate", "hot fudge", "brownie", "oreo", "m&m", "heath", "butterfinger", "nutella", "reese's"],
  },
  { name: "Nuts", keywords: ["nut"], members: ["tree nuts", "peanuts"] },
  { name: "Tree nuts", keywords: ["tree nut"], members: ["almond", "cashew", "pecan", "walnut", "hazelnut", "nutella"], showChip: false },
  { name: "Peanuts", keywords: ["peanut", "pb"], members: ["peanut", "reese's"] },
  { name: "Candy", keywords: ["candies"], members: ["m&m", "heath", "butterfinger", "reese's", "candy", "marshmallow"] },
  { name: "Cookies", keywords: ["cookie", "crunchy"], members: ["oreo", "nilla wafer", "cookie dough", "graham cracker", "pretzel", "sugar cone", "brownie"] },
  // CONFIRM with the kitchen: ice cream bases and syrups aren't on the SOP sheets.
  {
    name: "Gluten",
    keywords: ["wheat"],
    members: ["nilla wafer", "oreo", "cookie dough", "brownie", "graham cracker", "pretzel", "sugar cone", "fried chicken"],
    showChip: false,
  },
  { name: "Meat", keywords: ["pork"], members: ["bacon", "chicken"], showChip: false },
];

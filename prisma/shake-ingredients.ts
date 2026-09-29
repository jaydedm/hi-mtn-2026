/**
 * Shake ingredients, transcribed from the kitchen's "SOP for Shakes" sheets (base + toppings,
 * quantities dropped, abbreviations spelled out: PB → peanut butter, HF → hot fudge).
 * Keyed by the menu's flavor name (lowercase, ® and accents ignored; see `ingredientKey`).
 *
 * Used by the seed (new databases) and prisma/apply-shake-ingredients.ts (existing ones).
 * After that the admin is the source of truth; edit ingredients there, not here.
 *
 * INFERRED marks flavors on the menu that aren't on the SOP sheets; their ingredients are
 * a best guess from the name and should be confirmed by the kitchen.
 */
export const INFERRED = ["butterfinger", "chocolate peanut butter", "marshmallow oreo", "nutella"];

export const SHAKE_INGREDIENTS: Record<string, string[]> = {
  // Classic
  cherry: ["cherry syrup", "maraschino cherry"],
  chocolate: ["chocolate"],
  ironport: ["ironport syrup"],
  vanilla: ["vanilla syrup", "nilla wafers"],

  // Deluxe
  banana: ["banana"],
  blackberry: ["blackberries"],
  blueberry: ["blueberries"],
  butterfinger: ["butterfinger"],
  caramel: ["caramel"],
  "caramel cashew": ["caramel", "cashews"],
  "cherry chocolate": ["cherry syrup", "chocolate", "maraschino cherry"],
  "cherry ironport": ["cherry syrup", "ironport syrup", "maraschino cherry"],
  "cherry lime": ["cherry syrup", "maraschino cherries", "lime", "maraschino cherry"],
  "cherry pecan": ["cherry syrup", "maraschino cherries", "pecans", "maraschino cherry"],
  "chocolate banana": ["chocolate", "banana"],
  "chocolate chip": ["chocolate chips"],
  "chocolate marshmallow": ["chocolate", "marshmallow creme", "marshmallows"],
  "chocolate oreo": ["chocolate", "oreo"],
  "chocolate peanut butter": ["chocolate", "peanut butter"],
  "chocolate strawberry": ["chocolate", "strawberry"],
  "cinnamon roll": ["cinnamon", "cream cheese"],
  "cookie dough": ["cookie dough"],
  "fresh lime": ["lime"],
  grasshopper: ["mint", "oreo"],
  heath: ["heath"],
  "hot fudge": ["hot fudge"],
  ladybug: ["strawberry", "oreo"],
  "m&m": ["m&m"],
  "maple nut": ["maple", "walnuts"],
  marshmallow: ["marshmallow creme", "marshmallows"],
  "marshmallow oreo": ["marshmallow creme", "oreo"],
  "mint chocolate chip": ["mint", "chocolate chips"],
  nutella: ["nutella"],
  oreo: ["oreo"],
  "pb & j": ["peanut butter", "strawberry", "peanut butter chips"],
  "peanut butter": ["peanut butter", "peanut butter chips"],
  pineapple: ["pineapple"],
  "reese's peanut butter cup": ["reese's peanut butter cup"],
  strawberry: ["strawberry"],
  "strawberry banana": ["strawberry", "banana"],

  // Premium
  "almond divinity": ["almond syrup", "almonds", "marshmallow creme"],
  "almond joy": ["hot fudge", "almonds", "coconut", "coconut syrup"],
  "almond poppyseed": ["almond syrup", "poppyseeds", "almonds"],
  "bacon maple": ["maple", "bacon"],
  "banana boat": ["banana", "chocolate chips", "marshmallows"],
  "banana cream pie": ["banana", "nilla wafers", "cream cheese", "whipped cream"],
  "banana split": ["banana", "hot fudge", "walnuts", "whipped cream", "maraschino cherry"],
  "bananas foster": ["banana", "caramel", "cinnamon"],
  "better than anything": ["brownie", "caramel", "heath", "whipped cream"],
  "black licorice": ["black licorice syrup", "black licorice candy"],
  "blackberry cheesecake": ["blackberries", "cream cheese", "nilla wafers"],
  "blueberry cheesecake": ["blueberries", "cream cheese", "nilla wafers"],
  "caramel nut brownie": ["caramel", "walnuts", "brownie"],
  "cherry colada": ["cherry syrup", "maraschino cherries", "coconut syrup", "shredded coconut", "maraschino cherry"],
  "cherry cordial": ["cherry syrup", "maraschino cherries", "hot fudge", "maraschino cherry"],
  "chicken & waffles": ["fried chicken", "maple syrup", "sugar cone"],
  "chocolate-covered pretzel": ["chocolate", "caramel", "pretzels"],
  "chocolate cream pie": ["chocolate", "nilla wafers", "cream cheese", "whipped cream"],
  "chunky monkey": ["peanut butter", "banana", "graham cracker", "peanuts", "peanut butter chips"],
  "coconut cream pie": ["coconut", "cream cheese", "coconut syrup", "nilla wafers", "whipped cream"],
  "cookie monster": ["cookie dough", "oreo"],
  "cream cheese brownie": ["brownie", "chocolate chips", "cream cheese"],
  "death by chocolate": ["chocolate", "hot fudge", "chocolate chips", "brownie"],
  divinity: ["maraschino cherries", "marshmallow creme", "maraschino cherry", "pecans"],
  firestick: ["cinnamon syrup", "cinnamon candy"],
  fluffernutter: ["peanut butter", "marshmallow creme", "nilla wafers", "peanut butter chips", "marshmallows"],
  "german chocolate cake": ["brownie", "coconut", "pecans", "caramel"],
  "hot fudge brownie": ["brownie", "hot fudge", "walnuts", "whipped cream"],
  "hula shake": ["strawberry", "banana", "pineapple", "coconut syrup", "shredded coconut"],
  "key lime pie": ["lime", "cream cheese", "nilla wafers", "whipped cream"],
  "lemon bar": ["lemon", "cream cheese"],
  "maple peanut butter crunch": ["maple", "peanut butter", "peanuts", "peanut butter chips"],
  "mexican hot chocolate": ["hot fudge", "chocolate", "cinnamon", "whipped cream"],
  "mint brownie": ["mint", "brownie"],
  "mountain berry": ["strawberry", "raspberries"],
  "nutty about you": ["nutella", "almonds", "almond syrup"],
  "one tough cookie": ["hot fudge", "peanut butter", "oreo", "peanut butter chips"],
  "pina colada": ["coconut", "coconut syrup", "pineapple"],
  raspberry: ["raspberries"],
  "raspberry cheesecake": ["raspberries", "cream cheese", "nilla wafers"],
  "raspberry fudge": ["raspberries", "hot fudge"],
  "raspberry lime": ["raspberries", "lime"],
  "raspberry pretzel jell-o": ["raspberries", "pretzels", "cream cheese", "whipped cream"],
  "rocky road": ["chocolate", "marshmallows", "almonds"],
  "s'mores": ["chocolate", "marshmallow creme", "graham cracker", "marshmallows"],
  snickerdoodle: ["cookie dough", "caramel", "cinnamon"],
  "sour watermelon": ["watermelon syrup", "sour syrup", "sour watermelon candy"],
  "sticky bun": ["cinnamon", "cream cheese", "pecans", "caramel"],
  "strawberry cheesecake": ["strawberry", "cream cheese", "nilla wafers"],
  "turtle pie": ["caramel", "hot fudge", "nilla wafers", "pecans", "whipped cream"],
  wildberry: ["blackberries", "blueberries", "raspberries"],
};

/** SOP entries with no matching flavor on the menu (reported, not seeded). */
export const SOP_NOT_ON_MENU = ["Fresh Lime Freeze", "Freeze", "Pumpkin Pie", "Salted Caramel"];

/** Normalizes a flavor name for lookup: lowercase, no ®/™/*, plain apostrophes, ñ → n. */
export const ingredientKey = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[®™*]/g, "")
    .replace(/[’‘]/g, "'")
    .toLowerCase()
    .trim();

/** Ingredients for a flavor (deduped, order kept), or [] if unknown. */
export const ingredientsFor = (name: string) => [...new Set(SHAKE_INGREDIENTS[ingredientKey(name)] ?? [])];

/** Ingredients apply to the Classic/Deluxe/Premium flavor lists, not Build-Your-Own toppings. */
export const isShakeFlavorList = (sectionSlug: string, itemName: string) =>
  sectionSlug === "shakes" && ["classic", "deluxe", "premium"].includes(itemName.toLowerCase());

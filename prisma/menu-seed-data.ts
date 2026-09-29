/**
 * The Hi-Mountain menu transcribed from the March 2026 PDF. Used to seed an empty
 * database; after that the admin editor is the source of truth.
 * Prices are in cents. "*" marks house-made.
 */

export type SeedOption = { label: string; price: number; addOn?: boolean };
export type SeedItem = {
  name: string;
  description?: string;
  price?: number;
  choicesLabel?: string;
  choices?: string[];
  options?: SeedOption[];
  /** Defaults: lunch true, afterHours = section default. */
  lunch?: boolean;
  afterHours?: boolean;
};
export type SeedSection = {
  slug: string;
  title: string;
  intro?: string;
  note?: string;
  /** Default After Hours visibility for this section's items. */
  afterHours: boolean;
  options?: SeedOption[];
  items: SeedItem[];
};

const SALAD_BASE = "mixed house greens, grated carrots, cubed american cheese, tomatoes, cucumbers";
const SPINACH_BASE = "spinach, grated carrots, cubed swiss cheese, peas, sliced mushrooms, crumbled bacon, poppyseed dressing*";

export const MENU_SEED: SeedSection[] = [
  {
    slug: "dinner-boxes",
    title: "Dinner Box Combos",
    intro: "Served with fries.",
    afterHours: true,
    items: [
      {
        name: "Chicken Tender Box",
        lunch: false,
        options: [
          { label: "2 tenders", price: 1100, addOn: false },
          { label: "4 tenders", price: 1550, addOn: false },
          { label: "6 tenders", price: 2100, addOn: false },
        ],
      },
      { name: "Fish & Chips Box", price: 2025, lunch: false },
      { name: "Coconut Shrimp Box", price: 2025, lunch: false },
    ],
  },
  {
    slug: "burgers",
    title: "The Burgers",
    intro:
      "Our award-winning burgers are almost 1/3 pound of supreme, extra-lean beef ground locally and hand-pattied by us each day for unbeatable freshness.",
    afterHours: false,
    options: [
      { label: "Add bacon", price: 300 },
      { label: "Double your burger", price: 550 },
    ],
    items: [
      { name: "Hamburger", price: 750, description: "mustard, ketchup, dill pickles, iceberg lettuce" },
      { name: "Cheeseburger", price: 800, description: "american, mustard, ketchup, dill pickles, iceberg lettuce" },
      { name: "Aussie Burger", price: 950, description: "fried egg, mustard, ketchup, dill pickles, iceberg lettuce" },
      {
        name: "Blue Burger",
        price: 1050,
        description: "sliced blue cheese, blue cheese dressing, tomatoes, dill pickles, iceberg lettuce",
      },
      { name: "Gonburger", price: 1075, description: "cheddar cheese, bacon, onion ring, smoky bbq, fry sauce" },
      { name: "Jalapeño Popper Burger", price: 1050, description: "jalapeños, cheddar cheese, onion ring, cream cheese" },
      {
        name: "Philly Cheeseburger",
        price: 1075,
        description: "swiss cheese, grilled onions, grilled bell peppers, grilled mushrooms, mayonnaise",
      },
      {
        name: "Backyard Burger",
        price: 975,
        description: "swiss cheese, mayonnaise, smoky bbq, tomatoes, onions, iceberg lettuce",
      },
      { name: "Wacburger", price: 1075, description: "ham, swiss, ranch dressing, dill pickles, iceberg lettuce" },
      {
        name: "Southern Belle",
        price: 1075,
        description: "cheddar and swiss cheese, dill pickles, onions, mayonnaise, smoky bbq, fried pickle spear",
      },
    ],
  },
  {
    slug: "sides",
    title: "Side Orders",
    afterHours: false,
    items: [
      { name: "Hand-Cut Fries", afterHours: true, price: 550 },
      { name: "Onion Rings", price: 650 },
      { name: "Cheese Fries", price: 800 },
      {
        name: "Bacon Cheese Fries",
        price: 1050,
        description: "smothered in ranch* or blue cheese*",
        options: [{ label: "with jalapeños", price: 1200, addOn: false }],
      },
      { name: "Homemade Scone", price: 550, description: "with cinnamon honey butter*" },
      { name: "Side Salad", price: 600, description: SALAD_BASE },
      { name: "Side Spinach Salad", price: 725, description: SPINACH_BASE },
    ],
  },
  {
    slug: "all-the-rest",
    title: "All the Rest",
    afterHours: false,
    items: [
      { name: "Chili Burger", price: 1350, description: "open-faced burger, chili*, grated cheddar cheese, onions" },
      {
        name: "Navajo Taco", afterHours: true,
        price: 1750,
        description: "scone, chili*, mixed house greens, tomatoes, onions, grated cheddar, served with sour cream and salsa",
      },
      { name: "Chili Dog", price: 1350, description: "nathan’s® jumbo all-beef dog, chili*, grated cheddar, onions" },
      { name: "Hot Dog", price: 750, description: "nathan’s® jumbo all-beef dog, ketchup, mustard, sweet relish" },
      { name: "Corn Dog", price: 450, description: "honey-battered turkey dog, ketchup and mustard" },
      { name: "Grilled Cheese", price: 500, description: "american cheese, white or wheat bread" },
      { name: "Grilled Ham & Cheese", price: 800, description: "american cheese, ham, white or wheat bread" },
      {
        name: "Grilled Tuna",
        price: 1050,
        description: "albacore tuna, salad dressing, iceberg lettuce, dill pickles, white or wheat bread",
      },
      {
        name: "Tuna Melt",
        price: 1150,
        description: "albacore tuna, salad dressing, cheddar cheese, iceberg lettuce, dill pickles, white or wheat bread",
      },
      { name: "Cluckburger", price: 750, description: "breaded chicken, honey mustard*, iceberg lettuce, tomatoes" },
      {
        name: "Vancluck",
        price: 1050,
        description: "breaded chicken breast, ham, swiss cheese, honey mustard*, iceberg lettuce, tomatoes",
      },
      { name: "Chicken Basket", price: 1575, description: "breaded chicken fingers, fries, white or wheat toast" },
      { name: "Chicken Plate", price: 1575, description: "breaded chicken fingers, side salad, white or wheat toast" },
      {
        name: "Hamburger Plate",
        price: 1600,
        description:
          "two hamburger patties, grilled onions, grilled bell peppers, and grilled mushrooms, side salad, white or wheat toast",
      },
      { name: "Seaburger", price: 850, description: "breaded haddock, tarter sauce*, iceberg lettuce, dill pickles" },
      { name: "Fish & Chips", price: 2075, description: "beer-battered cod fillets, fries, white or wheat toast" },
      { name: "Cod Fillet Plate", price: 2075, description: "beer-battered cod fillets, side salad, white or wheat toast" },
      {
        name: "Bowl of Chili", afterHours: true,
        price: 1000,
        description: "topped with onions and grated cheddar cheese",
        options: [{ label: "cup", price: 650, addOn: false }],
      },
    ],
  },
  {
    slug: "salads",
    title: "The Salads",
    afterHours: false,
    items: [
      { name: "Tossed Salad", price: 1250, description: SALAD_BASE },
      { name: "Ham & Cheese Salad", afterHours: true, price: 1450, description: `diced ham, ${SALAD_BASE}` },
      {
        name: "Cashew Chicken Salad", afterHours: true,
        price: 1650,
        description: "breaded chicken breast, mixed house greens, cashews, grated carrots, cubed american, tomatoes, cucumbers",
      },
      { name: "Shrimp Salad", price: 1650, description: `baby shrimp, ${SALAD_BASE}` },
      { name: "Tuna Salad", price: 1550, description: `albacore tuna, ${SALAD_BASE}` },
      { name: "Spinach Salad", price: 1350, description: SPINACH_BASE },
      { name: "Chicken Spinach Salad", price: 1700, description: `breaded chicken breast, ${SPINACH_BASE}` },
      { name: "Side Salad", price: 600, description: SALAD_BASE },
      { name: "Side Spinach Salad", price: 725, description: SPINACH_BASE },
      {
        name: "Dressings",
        choicesLabel: "Dressings",
        choices: ["ranch*", "blue cheese*", "honey mustard*", "poppyseed*", "thousand island", "fat-free raspberry vinaigrette"],
      },
    ],
  },
  {
    slug: "kids",
    title: "For the Kids",
    intro: "Served with fries & applesauce plus your choice of a fountain drink or Kool-aid Jammer®.",
    afterHours: false,
    items: [
      { name: "Kid’s Hamburger", price: 1000, description: "ketchup only" },
      { name: "Kid’s Cheeseburger", price: 1050, description: "ketchup only" },
      { name: "Kid’s Chicken Finger", price: 925 },
      { name: "Kid’s Grilled Cheese", price: 800 },
      {
        name: "Kid’s Mac & Cheese Crispies",
        price: 750,
        options: [{ label: "add three crispies", price: 200 }],
      },
      { name: "Kid’s Fish & Chips", price: 950 },
      { name: "Kid’s Hot Dog", price: 1000, description: "ketchup only" },
      { name: "Kid’s Corn Dog", price: 700 },
    ],
  },
  {
    slug: "shakes",
    title: "Shakes & Malts",
    intro:
      "Our thick, award-winning shakes and malts are hand-mixed when you order. With over 90 flavors to choose from (or the option to create your own), you’re sure to find that perfect combination!",
    afterHours: true,
    options: [{ label: "Make it a malt", price: 100 }],
    items: [
      { name: "Classic", price: 625, choicesLabel: "Flavors", choices: ["cherry", "chocolate", "ironport", "vanilla"] },
      {
        name: "Deluxe",
        price: 750,
        choicesLabel: "Flavors",
        choices: [
          "banana", "blackberry", "blueberry", "butterfinger®", "caramel", "caramel cashew", "cherry chocolate",
          "cherry ironport", "cherry lime", "cherry pecan", "chocolate banana", "chocolate chip",
          "chocolate marshmallow", "chocolate oreo®", "chocolate peanut butter", "chocolate strawberry",
          "cinnamon roll", "cookie dough", "fresh lime", "grasshopper", "heath®", "hot fudge", "ladybug", "m&m®",
          "maple nut", "marshmallow", "marshmallow oreo®", "mint chocolate chip", "nutella®", "oreo®", "pb & j",
          "peanut butter", "pineapple", "reese’s peanut butter cup®", "strawberry", "strawberry banana",
        ],
      },
      {
        name: "Premium",
        price: 875,
        choicesLabel: "Flavors",
        choices: [
          "almond divinity", "almond joy", "almond poppyseed", "bacon maple", "banana boat", "banana cream pie",
          "banana split", "bananas foster", "better than anything", "black licorice", "blackberry cheesecake",
          "blueberry cheesecake", "caramel nut brownie", "cherry colada", "cherry cordial", "chicken & waffles",
          "chocolate-covered pretzel", "chocolate cream pie", "chunky monkey", "coconut cream pie",
          "cookie monster", "cream cheese brownie", "death by chocolate", "divinity", "firestick", "fluffernutter",
          "german chocolate cake", "hot fudge brownie", "hula shake", "key lime pie", "lemon bar",
          "maple peanut butter crunch", "mexican hot chocolate", "mint brownie", "mountain berry", "nutty about you",
          "one tough cookie", "piña colada", "raspberry", "raspberry cheesecake", "raspberry fudge", "raspberry lime",
          "raspberry pretzel jell-o", "rocky road", "s’mores", "snickerdoodle", "sour watermelon", "sticky bun",
          "strawberry cheesecake", "turtle pie", "wildberry",
        ],
      },
      {
        name: "Build-Your-Own",
        price: 925,
        description: "choose up to three toppings",
        choicesLabel: "Toppings",
        options: [{ label: "each additional topping", price: 125 }],
        choices: [
          "almond topping*", "almonds", "bacon", "banana", "black licorice topping*", "blackberries", "blueberries",
          "brownie", "butterfinger®", "leatherby’s caramel", "cashews", "cherry syrup", "chocolate chips",
          "chocolate topping", "cinnamon", "cinnamon syrup*", "coconut topping*", "cookie dough",
          "philadelphia® cream cheese", "fresh-squeezed lemon", "fresh-squeezed lime", "fried chicken breast",
          "graham crackers", "heath®", "leatherby’s hot fudge", "ironport syrup", "m&m", "maple topping*",
          "maraschino cherries", "marshmallow creme", "marshmallows", "mint topping*", "nilla® wafers", "nutella®",
          "oreo®", "peanuts", "peanut butter", "pecans", "pineapple topping", "poppyseeds", "pretzels",
          "raspberries", "reese’s peanut butter cup®", "shredded coconut", "strawberry topping", "sugar cone",
          "vanilla syrup", "watermelon syrup*", "walnuts",
        ],
      },
    ],
  },
  {
    slug: "soda-shoppe",
    title: "Soda Shoppe",
    intro:
      "The perfect way to wrap up any meal is with one of our amazing ice cream creations. Whether you keep it to yourself or share with a friend (and yes, we are generous!), you won’t regret leaving room for one of these treats!",
    note: "We feature Leatherby’s Family Creamery ice cream.",
    afterHours: true,
    items: [
      { name: "Single Scoop", price: 450 },
      { name: "Double Scoop", price: 700 },
      { name: "Ice Cream Float", price: 800, description: "vanilla ice cream, fountain soda of your choice" },
      {
        name: "Ice Cream Sundae",
        price: 1125,
        description: "two scoops of ice cream, two toppings, walnuts, whipped cream, maraschino cherry",
      },
      {
        name: "Small Sundae",
        price: 775,
        description: "one scoop of ice cream, one topping, walnuts, whipped cream, maraschino cherry",
      },
      {
        name: "Ice Cream Soda",
        price: 750,
        description: "vanilla ice cream, carbonated water, and your choice of chocolate, strawberry, cherry, pineapple, or vanilla",
      },
      { name: "Ice Cream Freeze", price: 625, description: "vanilla ice cream and fountain soda of your choice, blended" },
      {
        name: "Hot Fudge Brownie",
        price: 1150,
        description: "homemade brownie, vanilla ice cream, hot fudge, walnuts, whipped cream, maraschino cherry",
      },
      {
        name: "Banana Split",
        price: 1650,
        description: "whole banana, three scoops of ice cream, three toppings, walnuts, whipped cream, maraschino cherry",
      },
      {
        name: "Toppings",
        choicesLabel: "Toppings",
        choices: [
          "almond topping*", "black licorice topping*", "leatherby’s caramel", "chocolate topping", "coconut topping*",
          "leatherby’s hot fudge", "maple topping*", "mint topping*", "marshmallow creme", "melted peanut butter",
          "pineapple topping", "strawberry topping",
        ],
      },
    ],
  },
  {
    slug: "drinks",
    title: "The Drinks",
    afterHours: true,
    items: [
      { name: "Fresh Lime", price: 550, description: "hand-squeezed limes, simple syrup, carbonated water" },
      { name: "Old-Fashioned Lemonade", price: 550, description: "hand-squeezed lemons, simple syrup, water" },
      {
        name: "Berry Lime or Lemonade",
        price: 650,
        description: "blackberry, blueberry, raspberry, or strawberry",
      },
      { name: "Sour Cherry", price: 450 },
      { name: "Ironport", price: 450 },
      { name: "Frosty Mug Soda", price: 425, afterHours: false },
      {
        name: "Fountain Drinks",
        price: 375,
        description: "Coca-Cola, Diet Coke, Coke Zero, Dr Pepper, Sprite, Barq’s Root Beer, Barq’s Red Crème, Fanta, Powerade",
      },
    ],
  },
];

/**
 * Menu content transcribed from the current printed menu PDF.
 * Prototype-only: in production this would live in the database
 * and be edited from the admin dashboard.
 */
export type MenuItem = { name: string; price: string; desc?: string; note?: string };
export type MenuSection = {
  id: string;
  title: string;
  blurb?: string;
  items: MenuItem[];
  footer?: string;
};

export const MENU: MenuSection[] = [
  {
    id: "burgers",
    title: "The Burgers",
    blurb:
      "Our award-winning burgers are almost 1/3 pound of supreme, extra-lean beef ground locally and hand-pattied by us each day. Add bacon for $3.00; double your burger for $5.50.",
    items: [
      { name: "Hamburger", price: "7.50", desc: "mustard, ketchup, dill pickles, iceberg lettuce" },
      { name: "Cheeseburger", price: "8.00", desc: "american, mustard, ketchup, dill pickles, iceberg lettuce" },
      { name: "Aussie Burger", price: "9.50", desc: "fried egg, mustard, ketchup, dill pickles, iceberg lettuce" },
      { name: "Blue Burger", price: "10.50", desc: "sliced blue cheese, blue cheese dressing, tomatoes, dill pickles, iceberg lettuce" },
      { name: "Gonburger", price: "10.75", desc: "cheddar cheese, bacon, onion ring, smoky bbq, fry sauce" },
      { name: "Jalapeño Popper Burger", price: "10.50", desc: "jalapeños, cheddar cheese, onion ring, cream cheese" },
      { name: "Philly Cheeseburger", price: "10.75", desc: "swiss cheese, grilled onions, grilled bell peppers, grilled mushrooms, mayonnaise" },
      { name: "Backyard Burger", price: "9.75", desc: "swiss cheese, mayonnaise, smoky bbq, tomatoes, onions, iceberg lettuce" },
      { name: "Wacburger", price: "10.75", desc: "ham, swiss, ranch dressing, dill pickles, iceberg lettuce" },
      { name: "Southern Belle", price: "10.75", desc: "cheddar and swiss cheese, dill pickles, onions, mayonnaise, smoky bbq, fried pickle spear" },
    ],
  },
  {
    id: "sides",
    title: "Side Orders",
    items: [
      { name: "Hand-Cut Fries", price: "5.50" },
      { name: "Onion Rings", price: "6.50" },
      { name: "Cheese Fries", price: "8.00" },
      { name: "Bacon Cheese Fries", price: "10.50", desc: "smothered in ranch or blue cheese", note: "with jalapeños 12.00" },
      { name: "Homemade Scone", price: "5.50", desc: "with cinnamon honey butter" },
      { name: "Side Salad", price: "6.00", desc: "mixed house greens, grated carrots, cubed american cheese, tomatoes, cucumbers" },
      { name: "Side Spinach Salad", price: "7.25", desc: "spinach, grated carrots, cubed swiss cheese, peas, sliced mushroom, crumbled bacon, poppyseed dressing" },
    ],
  },
  {
    id: "shakes",
    title: "Shakes & Malts",
    blurb:
      "Thick, award-winning shakes and malts, hand-mixed when you order. Over 90 flavors to choose from, or build your own. Make it a malt for $1 more.",
    items: [
      { name: "Classic", price: "6.25", desc: "cherry, chocolate, ironport, vanilla" },
      { name: "Deluxe", price: "7.50", desc: "banana, blackberry, butterfinger, caramel, cherry lime, chocolate marshmallow, cookie dough, grasshopper, hot fudge, mint chocolate chip, nutella, oreo, pb&j, strawberry… and more" },
      { name: "Premium", price: "8.75", desc: "almond joy, banana split, chicken & waffles, chunky monkey, death by chocolate, german chocolate cake, key lime pie, mexican hot chocolate, mountain berry, raspberry cheesecake, s'mores, turtle pie… and more" },
      { name: "Build-Your-Own", price: "9.25", desc: "choose up to three toppings; additional toppings $1.25 each" },
    ],
  },
  {
    id: "soda-shoppe",
    title: "Soda Shoppe",
    blurb: "We feature Leatherby's Family Creamery ice cream. And yes, we are generous.",
    items: [
      { name: "Single Scoop", price: "4.50" },
      { name: "Double Scoop", price: "7.00" },
      { name: "Ice Cream Float", price: "8.00", desc: "vanilla ice cream, fountain soda of your choice" },
      { name: "Ice Cream Soda", price: "7.50", desc: "vanilla ice cream, carbonated water, and your choice of chocolate, strawberry, cherry, pineapple, or vanilla" },
      { name: "Ice Cream Freeze", price: "6.25", desc: "vanilla ice cream and fountain soda of your choice, blended" },
      { name: "Small Sundae", price: "7.75", desc: "one scoop, one topping, walnuts, whipped cream, maraschino cherry" },
      { name: "Ice Cream Sundae", price: "11.25", desc: "two scoops, two toppings, walnuts, whipped cream, maraschino cherry" },
      { name: "Hot Fudge Brownie", price: "11.50", desc: "homemade brownie, vanilla ice cream, hot fudge, walnuts, whipped cream, maraschino cherry" },
      { name: "Banana Split", price: "16.50", desc: "whole banana, three scoops, three toppings, walnuts, whipped cream, maraschino cherry" },
    ],
  },
  {
    id: "all-the-rest",
    title: "All the Rest",
    items: [
      { name: "Chili Burger", price: "13.50", desc: "open-faced burger, house chili, grated cheddar, onions" },
      { name: "Navajo Taco", price: "17.50", desc: "scone, house chili, mixed greens, tomatoes, onions, grated cheddar, sour cream and salsa" },
      { name: "Chili Dog", price: "13.50", desc: "nathan's jumbo all-beef dog, house chili, grated cheddar, onions" },
      { name: "Hot Dog", price: "7.50", desc: "nathan's jumbo all-beef dog, ketchup, mustard, sweet relish" },
      { name: "Corn Dog", price: "4.50", desc: "honey-battered turkey dog" },
      { name: "Grilled Cheese", price: "5.00", desc: "american cheese, white or wheat" },
      { name: "Grilled Ham & Cheese", price: "8.00" },
      { name: "Tuna Melt", price: "11.50", desc: "albacore tuna, cheddar, iceberg lettuce, dill pickles" },
      { name: "Cluckburger", price: "7.50", desc: "breaded chicken, honey mustard, iceberg lettuce, tomatoes" },
      { name: "Vancluck", price: "10.50", desc: "breaded chicken breast, ham, swiss, honey mustard, lettuce, tomatoes" },
      { name: "Chicken Basket", price: "15.75", desc: "breaded chicken fingers, fries, white or wheat toast" },
      { name: "Hamburger Plate", price: "16.00", desc: "two patties, grilled onions, bell peppers, mushrooms, side salad, toast" },
      { name: "Seaburger", price: "8.50", desc: "breaded haddock, house tartar sauce, lettuce, dill pickles" },
      { name: "Fish & Chips", price: "20.75", desc: "beer-battered cod fillets, fries, toast" },
      { name: "Bowl of Chili", price: "10.00", desc: "topped with onions and grated cheddar", note: "cup 6.50" },
    ],
  },
  {
    id: "salads",
    title: "The Salads",
    items: [
      { name: "Tossed Salad", price: "12.50", desc: "mixed house greens, grated carrots, cubed american cheese, tomatoes, cucumbers" },
      { name: "Ham & Cheese Salad", price: "14.50" },
      { name: "Cashew Chicken Salad", price: "16.50", desc: "breaded chicken breast, mixed greens, cashews, carrots, american cheese, tomatoes, cucumbers" },
      { name: "Shrimp Salad", price: "16.50" },
      { name: "Tuna Salad", price: "15.50" },
      { name: "Spinach Salad", price: "13.50", desc: "spinach, carrots, swiss, peas, mushrooms, crumbled bacon, poppyseed dressing" },
      { name: "Chicken Spinach Salad", price: "17.00" },
    ],
    footer: "ranch · blue cheese · honey mustard · poppyseed · thousand island · fat-free raspberry vinaigrette",
  },
  {
    id: "drinks",
    title: "The Drinks",
    items: [
      { name: "Fresh Lime", price: "5.50", desc: "hand-squeezed limes, simple syrup, carbonated water" },
      { name: "Old-Fashioned Lemonade", price: "5.50", desc: "hand-squeezed lemons, simple syrup, water" },
      { name: "Berry Lime or Lemonade", price: "6.50", desc: "blackberry, blueberry, raspberry, or strawberry" },
      { name: "Sour Cherry", price: "4.50" },
      { name: "Ironport", price: "4.50" },
      { name: "Frosty Mug Soda", price: "4.25" },
      { name: "Fountain Drinks", price: "3.75" },
    ],
  },
  {
    id: "kids",
    title: "For the Kids",
    blurb: "Served with fries & applesauce plus a fountain drink or Kool-Aid Jammer.",
    items: [
      { name: "Kid's Hamburger", price: "10.00", desc: "ketchup only" },
      { name: "Kid's Cheeseburger", price: "10.50", desc: "ketchup only" },
      { name: "Kid's Chicken Fingers", price: "9.25" },
      { name: "Kid's Grilled Cheese", price: "8.00" },
      { name: "Kid's Mac & Cheese Crispies", price: "7.50" },
      { name: "Kid's Fish & Chips", price: "9.50" },
      { name: "Kid's Hot Dog", price: "10.00" },
      { name: "Kid's Corn Dog", price: "7.00" },
    ],
  },
];

export const FEATURED = {
  burger: MENU[0].items[4], // Gonburger
  shake: "Over 90 shake flavors",
  scone: MENU[1].items[4],
};

export const ADDRESS = "40 N Main St, Kamas, UT 84036";
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=40+N+Main+St,+Kamas,+UT+84036";
export const PHONE = "(435) 783-4466";
export const PHONE_HREF = "tel:+14357834466";

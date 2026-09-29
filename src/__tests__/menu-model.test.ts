import { describe, it, expect } from "vitest";
import {
  formatPrice,
  optionPriceLabel,
  parsePrice,
  searchKey,
  sectionsForMenu,
  slugify,
  houseMadeRuns,
  validateIds,
  validateItemInput,
  matchChoice,
  searchTerms,
  validateSearchGroups,
  type SearchGroupDto,
  validateSectionInput,
  type MenuItemDto,
  type MenuSectionDto,
} from "@/lib/menu-model";
import { MENU_SEED } from "../../prisma/menu-seed-data";
import { ingredientsFor } from "../../prisma/shake-ingredients";
import { DEFAULT_SEARCH_GROUPS } from "../../prisma/search-groups";

const item = (patch: Partial<MenuItemDto>): MenuItemDto => ({
  id: "i",
  name: "Hamburger",
  description: null,
  priceCents: 750,
  choicesLabel: null,
  onLunch: true,
  onAfterHours: false,
  isAvailable: true,
  options: [],
  choices: [],
  ...patch,
});
const section = (patch: Partial<MenuSectionDto>): MenuSectionDto => ({
  id: "s",
  slug: "s",
  title: "S",
  intro: null,
  note: null,
  isVisible: true,
  options: [],
  items: [],
  ...patch,
});

describe("prices", () => {
  it("formats cents", () => {
    expect(formatPrice(750)).toBe("7.50");
    expect(formatPrice(2025)).toBe("20.25");
    expect(formatPrice(0)).toBe("0.00");
  });
  it("parses dollars", () => {
    expect(parsePrice("7.5")).toBe(750);
    expect(parsePrice("$10.75")).toBe(1075);
    expect(parsePrice(" 9 ")).toBe(900);
    expect(parsePrice("0.29")).toBe(29);
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("abc")).toBeNaN();
    expect(parsePrice("1.234")).toBeNaN();
    expect(parsePrice("-1")).toBeNaN();
  });
  it("labels add-ons with a plus", () => {
    expect(optionPriceLabel({ priceCents: 125, isAddOn: true })).toBe("+1.25");
    expect(optionPriceLabel({ priceCents: 650, isAddOn: false })).toBe("6.50");
  });
});

describe("sectionsForMenu", () => {
  const menu = [
    section({
      id: "a",
      items: [
        item({ id: "1" }),
        item({ id: "2", onAfterHours: true }),
        item({ id: "3", onAfterHours: true, isAvailable: false }),
      ],
    }),
    section({ id: "b", items: [item({ id: "4", onLunch: false, onAfterHours: true })] }),
    section({ id: "c", isVisible: false, items: [item({ id: "5", onAfterHours: true })] }),
  ];
  it("keeps lunch items and drops empty or hidden sections", () => {
    const lunch = sectionsForMenu(menu, "lunch");
    expect(lunch.map((s) => s.id)).toEqual(["a"]);
    expect(lunch[0].items.map((i) => i.id)).toEqual(["1", "2"]);
  });
  it("keeps After Hours items, skipping unavailable ones", () => {
    const ah = sectionsForMenu(menu, "after-hours");
    expect(ah.map((s) => [s.id, s.items.map((i) => i.id)])).toEqual([
      ["a", ["2"]],
      ["b", ["4"]],
    ]);
  });
});

describe("text helpers", () => {
  it("normalizes search keys", () => {
    expect(searchKey("Piña Colada®")).toBe("pina colada");
    expect(searchKey("almond topping*")).toBe("almond topping");
    expect(searchKey("reese’s")).toBe("reese's");
  });
  it("slugifies titles", () => {
    expect(slugify("Shakes & Malts")).toBe("shakes-and-malts");
    expect(slugify("!!!")).toBe("section");
  });
  it("splits at house-made markers", () => {
    expect(houseMadeRuns("scone, chili*, greens")).toEqual([{ text: "scone, ", houseMade: false }, { text: "chili", houseMade: true }, { text: ", greens", houseMade: false }]);
    expect(houseMadeRuns("smothered in ranch* or blue cheese*")).toEqual([
      { text: "smothered in ", houseMade: false },
      { text: "ranch", houseMade: true },
      { text: " or ", houseMade: false },
      { text: "blue cheese", houseMade: true },
    ]);
    expect(houseMadeRuns("with cinnamon honey butter*")).toEqual([{ text: "with ", houseMade: false }, { text: "cinnamon honey butter", houseMade: true }]);
    expect(houseMadeRuns("mint topping*")).toEqual([{ text: "mint topping", houseMade: true }]);
    expect(houseMadeRuns("plain")).toEqual([{ text: "plain", houseMade: false }]);
  });
});

describe("validateItemInput", () => {
  it("trims, defaults and dedupes choices", () => {
    const r = validateItemInput({ name: "  Deluxe ", priceCents: 750, choices: ["Oreo®", "oreo", " ", "banana"] });
    expect(r).toEqual({
      ok: true,
      value: {
        name: "Deluxe",
        description: null,
        priceCents: 750,
        choicesLabel: "Choices",
        onLunch: true,
        onAfterHours: false,
        isAvailable: true,
        options: [],
        choices: [
          { name: "Oreo®", ingredients: [] },
          { name: "banana", ingredients: [] },
        ],
      },
    });
  });
  it("accepts choices with ingredients (lowercased, deduped)", () => {
    const r = validateItemInput({
      name: "Premium",
      choices: [{ name: "German Chocolate Cake", ingredients: ["Coconut", " pecans ", "coconut", ""] }, "plain"],
    });
    expect(r.ok && r.value.choices).toEqual([
      { name: "German Chocolate Cake", ingredients: ["coconut", "pecans"] },
      { name: "plain", ingredients: [] },
    ]);
  });
  it("rejects bad input", () => {
    expect(validateItemInput({ name: "" }).ok).toBe(false);
    expect(validateItemInput({ name: "x", priceCents: 7.5 }).ok).toBe(false);
    expect(validateItemInput({ name: "x", priceCents: -1 }).ok).toBe(false);
    expect(validateItemInput({ name: "x", options: [{ label: "", priceCents: 100 }] }).ok).toBe(false);
    expect(validateItemInput({ name: "x", options: [{ label: "cup", priceCents: "6.50" }] }).ok).toBe(false);
    expect(validateItemInput({ name: "x", choices: "oreo" }).ok).toBe(false);
  });
  it("accepts unpriced lists", () => {
    const r = validateItemInput({ name: "Dressings", choicesLabel: "Dressings", choices: ["ranch*"] });
    expect(r.ok && r.value.priceCents).toBeNull();
  });
});

describe("validateSectionInput / validateIds", () => {
  it("validates sections", () => {
    expect(validateSectionInput({ title: "" }).ok).toBe(false);
    const r = validateSectionInput({ title: "Burgers", options: [{ label: "Add bacon", priceCents: 300 }] });
    expect(r.ok && r.value.options).toEqual([{ label: "Add bacon", priceCents: 300, isAddOn: true }]);
  });
  it("validates id lists", () => {
    expect(validateIds(["a", "b"]).ok).toBe(true);
    expect(validateIds(["a", "a"]).ok).toBe(false);
    expect(validateIds([]).ok).toBe(false);
    expect(validateIds("a").ok).toBe(false);
  });
});

describe("menu seed data", () => {
  const all = MENU_SEED.flatMap((s) => s.items);
  it("has unique section slugs", () => {
    expect(new Set(MENU_SEED.map((s) => s.slug)).size).toBe(MENU_SEED.length);
  });
  it("has the 91 shake flavors from the PDF", () => {
    const shakes = MENU_SEED.find((s) => s.slug === "shakes")!;
    const flavors = shakes.items.filter((i) => i.choicesLabel === "Flavors").flatMap((i) => i.choices ?? []);
    expect(flavors).toHaveLength(91);
  });
  it("passes the same validation the admin API uses", () => {
    for (const s of MENU_SEED) {
      expect(validateSectionInput({ ...s, options: (s.options ?? []).map((o) => ({ label: o.label, priceCents: o.price })) }).ok).toBe(true);
      for (const i of s.items) {
        const r = validateItemInput({
          ...i,
          priceCents: i.price ?? null,
          options: (i.options ?? []).map((o) => ({ label: o.label, priceCents: o.price, isAddOn: o.addOn })),
        });
        expect(r.ok, i.name).toBe(true);
      }
    }
  });
  it("every item has a price, price options, or a list", () => {
    for (const i of all) expect(i.price !== undefined || i.options?.length || i.choices?.length, i.name).toBeTruthy();
  });
});

describe("ingredient search", () => {
  // The real shake data + default groups, so these tests cover the actual menu.
  const flavors = MENU_SEED.find((x) => x.slug === "shakes")!
    .items.filter((i) => ["Classic", "Deluxe", "Premium"].includes(i.name))
    .flatMap((i) => i.choices ?? [])
    .map((name) => ({ name, ingredients: ingredientsFor(name) }));
  const groups: SearchGroupDto[] = DEFAULT_SEARCH_GROUPS.map((g, i) => ({
    id: `g${i}`,
    name: g.name,
    keywords: g.keywords ?? [],
    members: g.members,
    showChip: g.showChip !== false,
  }));
  const find = (q: string) => {
    const terms = searchTerms(q, groups);
    return flavors.filter((f) => matchChoice(f, terms)).map((f) => searchKey(f.name));
  };

  it("finds flavors by ingredient, not just by name", () => {
    const r = find("coconut");
    expect(r).toEqual(expect.arrayContaining(["german chocolate cake", "almond joy", "coconut cream pie", "pina colada", "hula shake", "cherry colada"]));
    expect(r).not.toContain("strawberry");
  });

  it("expands groups one way: chocolate includes hot fudge, hot fudge excludes plain chocolate", () => {
    const choc = find("chocolate");
    expect(choc).toEqual(expect.arrayContaining(["hot fudge", "raspberry fudge", "oreo", "cream cheese brownie", "chocolate"]));
    const fudge = find("hot fudge");
    expect(fudge).toContain("raspberry fudge");
    expect(fudge).not.toContain("chocolate");
    expect(fudge).not.toContain("chocolate chip");
  });

  it("fruit finds every fruit shake and nothing without fruit", () => {
    const fruit = find("fruit");
    expect(fruit).toEqual(expect.arrayContaining(["strawberry", "wildberry", "banana split", "key lime pie", "cherry", "pineapple", "lemon bar"]));
    expect(fruit).not.toContain("oreo");
    expect(fruit).not.toContain("peanut butter");
  });

  it("nuts cover tree nuts and peanuts (nested groups), without matching coconut", () => {
    const nuts = find("nuts");
    expect(nuts).toEqual(expect.arrayContaining(["german chocolate cake", "maple nut", "rocky road", "pb & j", "reese's peanut butter cup", "nutella", "caramel cashew"]));
    expect(nuts).not.toContain("coconut cream pie");
    expect(find("tree nuts")).not.toContain("pb & j");
    // Every peanut flavor, whether the name says so or not.
    for (const q of ["nuts", "nut", "peanuts", "peanut", "pb"]) {
      expect(find(q)).toEqual(
        expect.arrayContaining(["pb & j", "peanut butter", "chocolate peanut butter", "reese's peanut butter cup", "chunky monkey", "fluffernutter", "one tough cookie", "maple peanut butter crunch"]),
      );
    }
  });

  it("handles plurals, singulars and blank queries", () => {
    expect(find("pecan")).toEqual(find("pecans"));
    expect(find("blueberry")).toContain("wildberry");
    expect(searchTerms("  ", groups)).toEqual([]);
    expect(matchChoice({ name: "oreo" }, searchTerms("oreo"))).toEqual({ name: true, ingredients: [] });
  });

  it("validates search groups", () => {
    expect(validateSearchGroups([{ name: "Nuts", keywords: ["Nut", "nut"], members: ["Macadamia"] }])).toEqual({
      ok: true,
      value: [{ name: "Nuts", keywords: ["nut"], members: ["macadamia"], showChip: true }],
    });
    expect(validateSearchGroups([{ name: "A", members: ["x"] }, { name: "a", members: ["y"] }]).ok).toBe(false);
    expect(validateSearchGroups([{ name: "Empty", members: [] }]).ok).toBe(false);
  });
});

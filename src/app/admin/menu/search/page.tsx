import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { loadMenu, loadSearchGroups } from "@/lib/menu-data";
import { PageHeader } from "../../_components/ui";
import { SearchGroupsEditor, type Flavor } from "./search-groups-editor";

export default async function SearchGroupsPage() {
  const [sections, groups] = await Promise.all([loadMenu(), loadSearchGroups()]);
  // Every choice that has ingredients (the shake flavors), for "test a search" and coverage.
  const flavors: Flavor[] = sections.flatMap((s) =>
    s.items.flatMap((i) => i.choices.filter((c) => c.ingredients.length).map((c) => ({ name: c.name, list: i.name, ingredients: c.ingredients }))),
  );
  return (
    <>
      <Link href="/admin/menu" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Menu
      </Link>
      <PageHeader
        title="Search groups"
        description="Words like “Fruit” or “Nuts” that stand for a family of ingredients. Searching a group on the website finds every flavor containing any of its ingredients. It only works one way: “chocolate” finds hot fudge shakes, but “hot fudge” doesn’t find plain chocolate."
      />
      <SearchGroupsEditor initial={groups} flavors={flavors} />
    </>
  );
}

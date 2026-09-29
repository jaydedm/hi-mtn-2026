import { loadMenu } from "@/lib/menu-data";
import { MenuEditor } from "./menu-editor";

export default async function AdminMenuPage() {
  const sections = await loadMenu();
  return <MenuEditor initial={sections} />;
}

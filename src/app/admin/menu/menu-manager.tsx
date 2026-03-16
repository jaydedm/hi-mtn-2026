"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Menu = {
  id: string;
  filename: string;
  isActive: boolean;
  createdAt: string;
};

export function MenuManager({ initial }: { initial: Menu[] }) {
  const [menus, setMenus] = useState<Menu[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [error, setError] = useState("");

  const refresh = async () => {
    const res = await fetch("/api/menu");
    if (res.ok) setMenus(await res.json());
  };

  const upload = async (file: File) => {
    setError("");
    if (file.type !== "application/pdf") return setError("Only PDF files are allowed.");
    const maxSize = 4.5 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return setError(`File is ${sizeMB} MB — maximum allowed size is 4.5 MB.`);
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/menu", { method: "POST", body: form });
    if (!res.ok) {
      setError("Upload failed. Please try a smaller file.");
    } else {
      await refresh();
    }
    setUploading(false);
  };

  const setActive = async (id: string) => {
    await fetch("/api/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this menu PDF?")) return;
    await fetch("/api/menu", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await refresh();
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          dragOver ? "border-mustard bg-mustard/10" : "border-border bg-card"
        }`}
      >
        <p className="text-lg font-semibold text-forest-dark mb-2">
          {uploading ? "Uploading…" : "Drag & drop a PDF here"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <label className="inline-block cursor-pointer bg-forest text-cream px-4 py-2 rounded font-semibold hover:bg-forest-dark transition-colors">
          Browse Files
          <input type="file" accept=".pdf" onChange={onFileSelect} className="hidden" />
        </label>
        {error && (
          <p className="mt-4 text-red-600 font-semibold text-sm">{error}</p>
        )}
      </div>

      {/* Menu table */}
      {menus.length === 0 ? (
        <p className="text-muted-foreground">No menus uploaded yet.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-forest text-cream">
                <th className="text-left py-3 px-4 font-semibold">File</th>
                <th className="text-left py-3 px-4 font-semibold">Uploaded</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-right py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m.id} className="border-t border-border even:bg-cream-dark">
                  <td className="py-3 px-4">
                    <a
                      href={`/menus/${m.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest underline hover:text-mustard"
                    >
                      {m.filename.replace(/^\d+-/, "")}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {m.isActive ? (
                      <Badge className="bg-forest text-cream">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {!m.isActive && (
                      <Button size="sm" onClick={() => setActive(m.id)} className="bg-mustard text-forest-dark hover:bg-mustard-light">
                        Set Active
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => remove(m.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

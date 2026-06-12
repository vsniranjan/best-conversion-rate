"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Category = "bug" | "feature" | "feedback";

export default function FeedbackWidget() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("feedback");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function submit() {
    if (!title.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, name, email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setTitle("");
      setDescription("");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }
  const inputClassName =
    "rounded-lg border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-400";

  const tagClassName =
    "h-auto rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-gray-400 data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white";

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2'>
      <Popover onOpenChange={() => setStatus("idle")}>
        <PopoverTrigger asChild>
          <Button className='rounded-full bg-black text-white shadow-md hover:bg-gray-800'>
            Feedback
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          side='top'
          sideOffset={8}
          collisionPadding={16}
          className='w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg flex flex-col gap-3'
        >
          {status === "done" ? (
            <p className='text-sm text-brand-green'>Thanks, got it.</p>
          ) : (
            <>
              <p className='text-sm font-medium text-muted'>Send feedback</p>

              <ToggleGroup
                type='single'
                value={category}
                onValueChange={(val) => val && setCategory(val as Category)}
                className='justify-start gap-2'
              >
                <ToggleGroupItem value='bug' className={tagClassName}>
                  Bug
                </ToggleGroupItem>
                <ToggleGroupItem value='feature' className={tagClassName}>
                  Feature
                </ToggleGroupItem>
                <ToggleGroupItem value='feedback' className={tagClassName}>
                  Feedback
                </ToggleGroupItem>
              </ToggleGroup>

              <Input
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClassName}
              />

              <Textarea
                placeholder='Description (optional)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={inputClassName}
              />

              <Input
                placeholder='Name (optional)'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />

              <Input
                placeholder='Email (optional)'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClassName}
              />

              <Button
                onClick={submit}
                disabled={status === "loading" || !title.trim()}
                className='rounded-lg bg-black py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50'
              >
                {status === "loading" ? "Sending..." : "Submit"}
              </Button>

              {status === "error" && (
                <p className='text-xs text-red-500'>
                  Something went wrong. Try again.
                </p>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

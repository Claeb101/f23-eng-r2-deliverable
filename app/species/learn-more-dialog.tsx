"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
export type Species = Database["public"]["Tables"]["species"]["Row"];

export const LearnMore = ({ species }: { species: Species }) => {
  const [data, setData] = useState(species);

  const getAuthor = async () => {
    const supabase = createClientComponentClient<Database>();
    const res = await supabase.from("profiles").select().eq("id", species.author);
    if (res.error) {
      return toast({
        title: "Something went wrong.",
        description: res.error.message,
        variant: "destructive",
      });
    } else {
      setData({ ...data, author: res.data[0] });
    }
  };
  return (
    <Dialog onOpenChange={(o) => {
      if(o) void getAuthor()
    }}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data.common_name}</DialogTitle>
        </DialogHeader>

        <div>
          <p>Id: {data.id}</p>
          <p>Scientific Name: {data.scientific_name}</p>
          <p>Common Name: {data.common_name}</p>
          <p>Total Population: {data.total_population}</p>
          <p>Kingdom: {data.kingdom}</p>
          <p>Description: {data.description}</p>
        </div>

        <div>
          <p>Author</p>
          <p>Email: {data.author.email}</p>
          <p>Display Name: {data.author.display_name}</p>
          <p>Biography: {data.author.biography}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

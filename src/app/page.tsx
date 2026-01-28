"use client";
import AnimatedList from "@/components/AnimatedList";
import ShinyText from "@/components/ShinyText";
import Shuffle from "@/components/Shuffle";
import { Form } from "@/components/ui/form";
import { usePartners } from "@/hooks/usePartners";
import { db } from "@/lib/db";
import { deletePartner } from "@/lib/db.items";
import Image from "next/image";

export default function Home() {
  const { partners } = usePartners();

  const items = partners;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <p className="font-bold size text-3xl ">
            Pokemon Go Trading Overview
          </p>
        </div>
        <AnimatedList
          items={items}
          onDelete={() => deletePartner}
          onItemSelect={(item) => deletePartner(item.id)}
          showGradients
          enableArrowNavigation
          displayScrollbar
        />
        <Form></Form>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Bot, MessageCircle, Users, Clock } from "lucide-react";

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold">WhatsApp AI Business Assistant</h1>
      <p className="text-zinc-400 mt-2">
        AI-powered customer conversations, lead capture, and business automation.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card icon={<Users />} title="Total Leads" value={leads.length} />
        <Card icon={<MessageCircle />} title="Messages" value={leads.length} />
        <Card icon={<Bot />} title="AI Replies" value={leads.length} />
        <Card icon={<Clock />} title="Status" value="Live" />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Leads</h2>

        <div className="grid gap-5">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex justify-between">
                <p className="text-green-400 font-semibold">
                  {lead.phone_number}
                </p>
                <p className="text-sm text-zinc-500">
                  {new Date(lead.created_at).toLocaleString()}
                </p>
              </div>

              <p className="mt-4">
                <span className="text-zinc-400">Customer:</span>{" "}
                {lead.customer_message}
              </p>

              <p className="mt-3">
                <span className="text-zinc-400">AI Reply:</span>{" "}
                {lead.ai_reply}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Card({ icon, title, value }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="text-green-400 mb-3">{icon}</div>
      <p className="text-zinc-400 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
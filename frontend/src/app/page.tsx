"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  MessageSquare,
  Users,
  Bot,
  Activity,
  Search,
  Download,
  LogOut,
  Phone,
} from "lucide-react";

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkUser();
    fetchLeads();

    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
    }
  }

  async function fetchLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const text = `${lead.phone_number} ${lead.customer_message} ${lead.ai_reply}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [leads, search]);

  function exportCSV() {
    const headers = ["Phone Number", "Customer Message", "AI Reply", "Created At"];

    const rows = filteredLeads.map((lead) => [
      lead.phone_number,
      lead.customer_message,
      lead.ai_reply,
      lead.created_at,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value || "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "whatsapp-ai-leads.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const todayLeads = leads.filter((lead) => {
    const today = new Date().toDateString();
    return new Date(lead.created_at).toDateString() === today;
  }).length;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-700 text-green-400 px-4 py-2 rounded-full text-sm mb-4">
              <Activity size={16} />
              Live SaaS Dashboard
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold">
              WhatsApp AI Business Assistant
            </h1>

            <p className="text-zinc-400 mt-3 max-w-2xl">
              AI-powered WhatsApp customer support, lead generation,
              conversation memory, and business automation dashboard.
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold w-fit"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <section className="grid md:grid-cols-4 gap-6 mb-10">
          <Card icon={<Users />} title="Total Leads" value={leads.length} />
          <Card icon={<MessageSquare />} title="Messages" value={leads.length} />
          <Card icon={<Bot />} title="AI Replies" value={leads.length} />
          <Card icon={<Activity />} title="Today" value={todayLeads} />
        </section>

        <section className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">
                Lead Management
              </h2>
              <p className="text-zinc-500 mt-1">
                Search, monitor, and export WhatsApp AI conversations.
              </p>
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search by phone, customer message, or AI reply..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Recent Conversations
            </h2>

            <p className="text-zinc-500 text-sm">
              Showing {filteredLeads.length} of {leads.length}
            </p>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading dashboard...</p>
          ) : filteredLeads.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
              <p className="text-zinc-500">
                No matching leads found.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-green-700 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/10 text-green-400 p-3 rounded-xl">
                        <Phone size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {lead.phone_number}
                        </h3>

                        <p className="text-zinc-500 text-sm">
                          WhatsApp Lead
                        </p>
                      </div>
                    </div>

                    <span className="text-zinc-500 text-sm">
                      {new Date(lead.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-zinc-400 mb-2">
                        Customer Message
                      </p>

                      <p className="bg-zinc-800 p-4 rounded-xl min-h-24">
                        {lead.customer_message}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-400 mb-2">
                        AI Reply
                      </p>

                      <p className="bg-green-900/20 border border-green-700 p-4 rounded-xl min-h-24">
                        {lead.ai_reply}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

function Card({ icon, title, value }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-green-700 transition">
      <div className="text-green-400 mb-4">
        {icon}
      </div>

      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}
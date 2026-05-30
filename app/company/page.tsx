"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw, Building2 } from "lucide-react";
import { toast } from "sonner";
import {
  getCompany,
  updateCompany,
  type Company,
  type CompanyUpdate,
} from "@/services/company";

const EMPTY_COMPANY: Company = {
  _id: "",
  name: "",
  description: "",
  isActive: true,
  contact: {
    primaryPhone: "",
    whatsappNumber: "",
    primaryEmail: "",
    planEmail: "",
    legalEmail: "",
    privacyEmail: "",
    officeAddress: "",
    officeHours: "",
    responseTime: "",
  },
  social: {
    instagram: "",
    x: "",
    facebook: "",
    linkedin: "",
    tripadvisor: "",
    tiktok: "",
  },
  meta: {
    legalName: "",
    foundedYear: "",
    tagline: "",
  },
  almanac: {
    permitAvailability: "",
    permitStatus: "",
    nextDeparture: "",
    nextDepartureStatus: "",
    guideOnCall: "",
    seasonStatus: "",
    roadsStatus: "",
    waitingListStatus: "",
  },
  createdAt: "",
  updatedAt: "",
};

export default function CompanyPage() {
  const [form, setForm] = useState<Company>(EMPTY_COMPANY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await getCompany();
      setForm({ ...EMPTY_COMPANY, ...data.data, contact: { ...EMPTY_COMPANY.contact, ...data.data.contact }, social: { ...EMPTY_COMPANY.social, ...data.data.social }, meta: { ...EMPTY_COMPANY.meta, ...data.data.meta }, almanac: { ...EMPTY_COMPANY.almanac, ...data.data.almanac } });
      setDirty(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load company.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setField<K extends keyof Company>(key: K, value: Company[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  function setContact<K extends keyof Company["contact"]>(key: K, value: Company["contact"][K]) {
    setForm((f) => ({ ...f, contact: { ...f.contact, [key]: value } }));
    setDirty(true);
  }

  function setSocial<K extends keyof Company["social"]>(key: K, value: Company["social"][K]) {
    setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));
    setDirty(true);
  }

  function setMeta<K extends keyof Company["meta"]>(key: K, value: Company["meta"][K]) {
    setForm((f) => ({ ...f, meta: { ...f.meta, [key]: value } }));
    setDirty(true);
  }

  function setAlmanac<K extends keyof Company["almanac"]>(key: K, value: Company["almanac"][K]) {
    setForm((f) => ({ ...f, almanac: { ...f.almanac, [key]: value } }));
    setDirty(true);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const payload: CompanyUpdate = {
        name: form.name,
        description: form.description,
        isActive: form.isActive,
        contact: form.contact,
        social: form.social,
        meta: form.meta,
        almanac: form.almanac,
      };
      const { data } = await updateCompany(payload);
      setForm({ ...EMPTY_COMPANY, ...data.data, contact: { ...EMPTY_COMPANY.contact, ...data.data.contact }, social: { ...EMPTY_COMPANY.social, ...data.data.social }, meta: { ...EMPTY_COMPANY.meta, ...data.data.meta }, almanac: { ...EMPTY_COMPANY.almanac, ...data.data.almanac } });
      setDirty(false);
      toast.success("Company saved. Trigger a revalidate to push it live.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save company.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader pageTitle="Company" />

        <div className="flex-1 space-y-6 p-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold">Company profile</h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">
                Everything the public site reads from one record: contact channels, office details, social links, the live almanac, and the brand description shown in the footer.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={load} disabled={loading || saving}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Reload
              </Button>
              <Button onClick={save} disabled={!dirty || saving || loading}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-20">Loading…</div>
          ) : (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="almanac">Almanac</TabsTrigger>
              </TabsList>

              {/* ── Profile ── */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand</CardTitle>
                    <CardDescription>
                      The name and description shown across the public site, including the footer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Field label="Display name" value={form.name} onChange={(v) => setField("name", v)} placeholder="Wholesome Uganda" />
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Premium guided adventure across Uganda since 2014."
                      />
                    </div>
                    <Separator />
                    <Field label="Legal name" value={form.meta.legalName} onChange={(v) => setMeta("legalName", v)} placeholder="Wholesome Uganda Ltd." />
                    <Field label="Founded year" value={form.meta.foundedYear} onChange={(v) => setMeta("foundedYear", v)} placeholder="2014" />
                    <Field label="Tagline" value={form.meta.tagline} onChange={(v) => setMeta("tagline", v)} placeholder="Six parks, one country." />
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Active</Label>
                        <p className="text-xs text-muted-foreground">
                          When off, the company record is hidden from the public API.
                        </p>
                      </div>
                      <Switch
                        checked={form.isActive}
                        onCheckedChange={(v) => setField("isActive", Boolean(v))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Contact ── */}
              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Channels</CardTitle>
                    <CardDescription>Phone numbers and email addresses used across the site.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Primary phone" value={form.contact.primaryPhone} onChange={(v) => setContact("primaryPhone", v)} placeholder="+256 414 000 000" />
                    <Field label="WhatsApp number" value={form.contact.whatsappNumber} onChange={(v) => setContact("whatsappNumber", v)} placeholder="+256 700 000 000" />
                    <Field label="Primary email" value={form.contact.primaryEmail} onChange={(v) => setContact("primaryEmail", v)} placeholder="hello@wholesomeuganda.com" />
                    <Field label="Trip planning email" value={form.contact.planEmail} onChange={(v) => setContact("planEmail", v)} placeholder="plan@wholesomeuganda.co" />
                    <Field label="Legal email" value={form.contact.legalEmail} onChange={(v) => setContact("legalEmail", v)} placeholder="legal@wholesomeuganda.com" />
                    <Field label="Privacy email" value={form.contact.privacyEmail} onChange={(v) => setContact("privacyEmail", v)} placeholder="privacy@wholesomeuganda.com" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Office</CardTitle>
                    <CardDescription>Where you're based, when you're open, and how fast you reply.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Field label="Office address" value={form.contact.officeAddress} onChange={(v) => setContact("officeAddress", v)} placeholder="Kololo Hill, Kampala" />
                    <Field label="Office hours" value={form.contact.officeHours} onChange={(v) => setContact("officeHours", v)} placeholder="Mon — Sat · 8 am — 6 pm EAT" />
                    <Field label="Response time" value={form.contact.responseTime} onChange={(v) => setContact("responseTime", v)} placeholder="Within 24 hours" />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Social ── */}
              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Social profiles</CardTitle>
                    <CardDescription>
                      Full URLs. Leave blank to hide an icon from the footer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Instagram" value={form.social.instagram} onChange={(v) => setSocial("instagram", v)} placeholder="https://instagram.com/…" />
                    <Field label="X (Twitter)" value={form.social.x} onChange={(v) => setSocial("x", v)} placeholder="https://x.com/…" />
                    <Field label="Facebook" value={form.social.facebook} onChange={(v) => setSocial("facebook", v)} placeholder="https://facebook.com/…" />
                    <Field label="LinkedIn" value={form.social.linkedin} onChange={(v) => setSocial("linkedin", v)} placeholder="https://linkedin.com/company/…" />
                    <Field label="TripAdvisor" value={form.social.tripadvisor} onChange={(v) => setSocial("tripadvisor", v)} placeholder="https://tripadvisor.com/…" />
                    <Field label="TikTok" value={form.social.tiktok} onChange={(v) => setSocial("tiktok", v)} placeholder="https://tiktok.com/@…" />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Almanac ── */}
              <TabsContent value="almanac" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Live almanac</CardTitle>
                    <CardDescription>
                      The "state of the season" rows shown on the homepage and contact page. Short, headline-style copy works best.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Permit availability" value={form.almanac.permitAvailability} onChange={(v) => setAlmanac("permitAvailability", v)} placeholder="4 remaining · Q2" />
                    <Field label="Permit status" value={form.almanac.permitStatus} onChange={(v) => setAlmanac("permitStatus", v)} placeholder="8 booked" />
                    <Field label="Next departure" value={form.almanac.nextDeparture} onChange={(v) => setAlmanac("nextDeparture", v)} placeholder="24 MAY" />
                    <Field label="Next departure status" value={form.almanac.nextDepartureStatus} onChange={(v) => setAlmanac("nextDepartureStatus", v)} placeholder="2 seats left" />
                    <Field label="Guide on call" value={form.almanac.guideOnCall} onChange={(v) => setAlmanac("guideOnCall", v)} placeholder="Joseph Mukasa" />
                    <Field label="Season status" value={form.almanac.seasonStatus} onChange={(v) => setAlmanac("seasonStatus", v)} placeholder="Long dry · ends 30 Jun" />
                    <Field label="Roads status" value={form.almanac.roadsStatus} onChange={(v) => setAlmanac("roadsStatus", v)} placeholder="Roads firm" />
                    <Field label="Waiting list" value={form.almanac.waitingListStatus} onChange={(v) => setAlmanac("waitingListStatus", v)} placeholder="Q3 closed · Q4 open" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {dirty && !saving && !loading && (
            <div className="sticky bottom-4 z-10 flex justify-end">
              <div className="rounded-full border bg-background shadow-md px-4 py-2 flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Unsaved changes</span>
                <Button size="sm" onClick={save}>
                  <Save className="mr-2 h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/data/catalog";

export function ContactForm() {
  const [interest, setInterest] = React.useState(services[0]?.slug ?? "office-furnishing");
  const [submitting, setSubmitting] = React.useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setSubmitting(true);
        window.setTimeout(() => {
          setSubmitting(false);
          toast.success("Enquiry received", {
            description: "A workspace consultant will reply within one working day.",
          });
          form.reset();
        }, 600);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="label-caps text-muted-foreground">
            Full name
          </Label>
          <Input id="name" name="name" required placeholder="Dana Cohen" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="label-caps text-muted-foreground">
            Company
          </Label>
          <Input id="company" name="company" placeholder="Northline Group" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="label-caps text-muted-foreground">
            Email
          </Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="label-caps text-muted-foreground">
            Phone
          </Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 415 555 0142" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="label-caps text-muted-foreground">I'm interested in</Label>
        <Select value={interest} onValueChange={setInterest}>
          <SelectTrigger className="h-11 rounded-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {services.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.name}
              </SelectItem>
            ))}
            <SelectItem value="furniture">Furniture purchase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="label-caps text-muted-foreground">
          Project brief
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Headcount, floor area, timeline, budget range…"
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Send enquiry"}
      </Button>
      <p className="text-xs text-muted-foreground">
        We reply within one working day. No newsletters unless you ask.
      </p>
    </form>
  );
}

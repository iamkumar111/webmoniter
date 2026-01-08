"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateSmtpConfig, testSmtpConfig } from "@/lib/actions";
import { Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const SmtpSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().min(1, "Port is required"),
  user: z.string().min(1, "User is required"),
  pass: z.string().min(1, "Password is required"),
  fromEmail: z.string().email("Invalid email"),
  fromName: z.string().min(1, "Sender name is required"),
});

type SmtpFormValues = z.infer<typeof SmtpSchema>;

interface SmtpFormProps {
  initialData?: SmtpFormValues | null;
}

export default function SmtpForm({ initialData }: SmtpFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isTesting, setIsTesting] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SmtpFormValues>({
    resolver: zodResolver(SmtpSchema) as any,
    defaultValues: initialData || {
      host: "",
      port: 587,
      user: "",
      pass: "",
      fromEmail: "",
      fromName: "websmonitor",
    },
  });

  const onSubmit = (data: SmtpFormValues) => {
    startTransition(async () => {
      try {
        await updateSmtpConfig(data);
        toast.success("SMTP settings saved successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save SMTP settings");
      }
    });
  };

  const onTest = async () => {
    if (!testRecipient) {
      toast.error("Please enter a recipient email address for testing");
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(testRecipient)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsTesting(true);
    try {
      const data = getValues();
      const result = await testSmtpConfig(data, testRecipient);
      if (result.success) {
        toast.success("Test email sent successfully! Check your inbox.");
      } else {
        toast.error(`SMTP Test failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to test SMTP settings");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            SMTP Host
          </label>
          <input
            {...register("host")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="smtp.example.com"
          />
          {errors.host && (
            <p className="text-sm font-medium text-red-500">{errors.host.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Port
          </label>
          <input
            {...register("port")}
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="587"
          />
          {errors.port && (
            <p className="text-sm font-medium text-red-500">{errors.port.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Username
          </label>
          <input
            {...register("user")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.user && (
            <p className="text-sm font-medium text-red-500">{errors.user.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Password
          </label>
          <input
            {...register("pass")}
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.pass && (
            <p className="text-sm font-medium text-red-500">{errors.pass.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            From Email
          </label>
          <input
            {...register("fromEmail")}
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="noreply@example.com"
          />
          {errors.fromEmail && (
            <p className="text-sm font-medium text-red-500">{errors.fromEmail.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            From Name
          </label>
          <input
            {...register("fromName")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="websmonitor"
          />
          {errors.fromName && (
            <p className="text-sm font-medium text-red-500">{errors.fromName.message}</p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1 space-y-2 max-w-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Test Recipient Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              placeholder="test@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button
              type="button"
              onClick={onTest}
              disabled={isPending || isTesting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Test</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400">Enter an email to test your SMTP settings without saving.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || isTesting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-6 py-2 shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

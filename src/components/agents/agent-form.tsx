"use client";
import toast from "react-hot-toast";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ChevronDown,
  Upload,
  X,
  FileText,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadedFile {
    id?: string;     
  name: string;
  size: number;
  file: File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function CollapsibleSection({
  title,
  description,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  badge?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="mt-1">
                    {description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {badge !== undefined && badge > 0 && (
                  <Badge variant="destructive">
                    {badge} required
                  </Badge>
                )}
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <CardContent className="pt-6">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export interface AgentFormInitialData {
  agentName?: string;
  description?: string;
  callType?: string;
  language?: string;
  voice?: string;
  prompt?: string;
  model?: string;
  latency?: number;
  speed?: number;
  callScript?: string;
  serviceDescription?: string;
}
export interface Language {
  id: string;
  name: string;
}

export interface Voice {
  id: string;
  name: string;
  tag: string;
}

export interface Prompt {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
}

interface AgentFormProps {
  mode: "create" | "edit";
  initialData?: AgentFormInitialData;
}

export function AgentForm({ mode, initialData }: AgentFormProps) {
  // Form state — initialized from initialData when provided
  const [agentName, setAgentName] = useState(initialData?.agentName ?? "");
  const [callType, setCallType] = useState(initialData?.callType ?? "");
  const [agentId, setAgentId] = useState<string | null>(null);
  const [language, setLanguage] = useState(initialData?.language ?? "");
  const [voice, setVoice] = useState(initialData?.voice ?? "");
  const [prompt, setPrompt] = useState(initialData?.prompt ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [latency, setLatency] = useState([initialData?.latency ?? 0.5]);
  const [speed, setSpeed] = useState([initialData?.speed ?? 110]);
  const [description, setDescription] = useState(initialData?.description ?? "");
// Dropdown data from API
const [languagesOptions, setLanguagesOptions] = useState<Language[]>([]);
const [voicesOptions, setVoicesOptions] = useState<Voice[]>([]);
const [promptsOptions, setPromptsOptions] = useState<Prompt[]>([]);
const [modelsOptions, setModelsOptions] = useState<Model[]>([]);
const [isDirty, setIsDirty] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
const [loadingLanguages, setLoadingLanguages] = useState(true);
const [loadingVoices, setLoadingVoices] = useState(true);
const [loadingPrompts, setLoadingPrompts] = useState(true);
const [loadingModels, setLoadingModels] = useState(true);
  
  // Call Script
  const [callScript, setCallScript] = useState(initialData?.callScript ?? "");

  // Service/Product Description
  const [serviceDescription, setServiceDescription] = useState(initialData?.serviceDescription ?? "");


     useEffect(() => {
  setLoadingLanguages(true);
  fetch(`${baseUrl}/languages`)
    .then(res => res.json())
    .then(data => setLanguagesOptions(data))
    .catch(() => toast.error("Failed to load languages"))
    .finally(() => setLoadingLanguages(false));

  setLoadingVoices(true);
  fetch(`${baseUrl}/voices`)
    .then(res => res.json())
    .then(data => setVoicesOptions(data))
    .catch(() => toast.error("Failed to load voices"))
    .finally(() => setLoadingVoices(false));

  setLoadingPrompts(true);
  fetch(`${baseUrl}/prompts`)
    .then(res => res.json())
    .then(data => setPromptsOptions(data))
    .catch(() => toast.error("Failed to load prompts"))
    .finally(() => setLoadingPrompts(false));

  setLoadingModels(true);
  fetch(`${baseUrl}/models`)
    .then(res => res.json())
    .then(data => setModelsOptions(data))
    .catch(() => toast.error("Failed to load models"))
    .finally(() => setLoadingModels(false));
}, []);
const handleFiles = useCallback(async (files: FileList | null) => {
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      toast.error(`File type not allowed: ${file.name}`);
      continue;
    }

    try {
      // Step 1: get signed URL
      const resUrl = await fetch(`${baseUrl}/attachments/upload-url`, { method: "POST" });
      if (!resUrl.ok) throw new Error("Failed to get signed URL");
      const { signedUrl, key } = await resUrl.json();

      // Step 2: upload file
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/octet-stream" },
      });
      if (!uploadRes.ok) throw new Error("File upload failed");

      // Step 3: register attachment
      const resRegister = await fetch(`${baseUrl}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, fileName: file.name, fileSize: file.size, mimeType: file.type }),
      });
      if (!resRegister.ok) throw new Error("Failed to register attachment");
      const data = await resRegister.json();

      // Step 4: store in state
      setUploadedFiles(prev => [...prev, { name: file.name, size: file.size, file, id: data.id }]);

      toast.success(`Uploaded: ${file.name}`);
    } catch (error) {
      console.error("File upload failed", error);
      toast.error(`Failed to upload file: ${file.name}`);
    }
  }
}, [baseUrl]);



///Handle save  agent ////
const validateForm = () => {
  const errors: string[] = [];
  if (!agentName) errors.push("Agent name is required");
  if (!callType) errors.push("Call type is required");
  if (!language) errors.push("Language is required");
  if (!voice) errors.push("Voice is required");
  if (!prompt) errors.push("Prompt is required");
  if (!model) errors.push("Model is required");

  if (errors.length) {
    errors.forEach(err => toast.error(err));
    return false;
  }
  return true;
};

const handleSaveWithValidation  = async () => {
  if (!validateForm()) return;

  const agentData = {
    name: agentName,
    description,
    callType,
    language,
    voice,
    prompt,
    model,
    latency: latency[0],
    speed: speed[0],
    callScript,
    serviceDescription,
    attachments: uploadedFiles.map(f => f.id),
    tools: {
      allowHangUp: false,
      allowCallback: false,
      liveTransfer: false,
    },
  };

  try {
    // استخدم POST لو مفيش agentId و PUT لو موجود
    const method = agentId ? "PUT" : "POST";
    const url = agentId ? `${baseUrl}/agents/${agentId}` : `${baseUrl}/agents`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentData),
    });

    if (!res.ok) throw new Error("Failed to save agent");

    const data = await res.json();
    console.log("Agent saved:", data);

    // خزّن الـ agentId لو كان POST جديد
    if (!agentId && data?.id) setAgentId(data.id);

    toast.success("Agent saved successfully!");
    return data; // مهم عشان Test Call يستخدم الـ agentId
  } catch (error) {
    console.error("Error saving agent:", error);
    toast.error("Error saving agent. Check console for details.");
  }
};


// Track changes in form fields
useEffect(() => {
  const initial = {
    agentName: initialData?.agentName ?? "",
    description: initialData?.description ?? "",
    callType: initialData?.callType ?? "",
    language: initialData?.language ?? "",
    voice: initialData?.voice ?? "",
    prompt: initialData?.prompt ?? "",
    model: initialData?.model ?? "",
    latency: initialData?.latency ?? 0.5,
    speed: initialData?.speed ?? 110,
    callScript: initialData?.callScript ?? "",
    serviceDescription: initialData?.serviceDescription ?? "",
  };

  const current = { agentName, description, callType, language, voice, prompt, model, latency: latency[0], speed: speed[0], callScript, serviceDescription };

  const changed = Object.keys(initial).some(key => initial[key as keyof typeof initial] !== current[key as keyof typeof current]);
  setIsDirty(changed);
}, [agentName, description, callType, language, voice, prompt, model, latency, speed, callScript, serviceDescription]);


// Warn user on page unload
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isDirty]);








  // Reference Data
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test Call
  const [testFirstName, setTestFirstName] = useState("");
  const [testLastName, setTestLastName] = useState("");
  const [testGender, setTestGender] = useState("");
  const [testPhone, setTestPhone] = useState("");


  
  // Badge counts for required fields
  const basicSettingsMissing = [agentName, callType, language, voice, prompt, model].filter(
    (v) => !v
  ).length;

  // File upload handlers
  const ACCEPTED_TYPES = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".csv",
    ".xlsx",
    ".xls",
  ];



  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  toast.dismiss(); // لو في toast للـ drag ممكن نغلقه
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);

  const files = e.dataTransfer.files;
  if (!files || files.length === 0) return;

  toast.loading(`${files.length} file(s) processing...`);
  handleFiles(files)
    .then(() => toast.success("Files uploaded successfully!"))
    .catch(() => toast.error("Some files failed to upload."));
};

const handleTestCall = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

  // Validation: تأكد من تعبئة بيانات الـ Test Call
  if (!testFirstName || !testLastName || !testPhone) {
    toast.error("Please fill in First Name, Last Name, and Phone Number before testing.");
    return;
  }

  // Use current agentId or save first if not available
  let currentAgentId = agentId;
  if (!currentAgentId) {
    const savedAgent = await handleSaveWithValidation();
    if (!savedAgent?.id) {
      toast.error("Cannot start test call without saving the agent first.");
      return;
    }
    currentAgentId = savedAgent.id;
    setAgentId(currentAgentId);
  }

  // Prepare test call data
  const testData = {
    firstName: testFirstName,
    lastName: testLastName,
    gender: testGender,
    phoneNumber: testPhone,
  };

  // Show loading toast
  const loadingToast = toast.loading("Starting test call...");

  try {
    const res = await fetch(`${baseUrl}/agents/${currentAgentId}/test-call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Test call failed");
    }

    const data = await res.json();
    console.log("Test Call Response:", data);

    // Success toast
    toast.dismiss(loadingToast);
    toast.success("Test Call Started!");
  } catch (error) {
    console.error("Test Call Failed:", error);
    toast.dismiss(loadingToast);
    toast.error("Test Call Failed! Check console for details.");
  }
};





  const heading = mode === "create" ? "Create Agent" : "Edit Agent";
  const saveLabel = mode === "create" ? "Save Agent" : "Save Changes";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{heading}</h1>
<Button onClick={handleSaveWithValidation }>{saveLabel}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Collapsible Sections */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Section 1: Basic Settings */}
          <CollapsibleSection
            title="Basic Settings"
            description="Add some information about your agent to get started."
            badge={basicSettingsMissing}
            defaultOpen
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">
                  Agent Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="agent-name"
                  placeholder="e.g. Sales Assistant"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe what this agent does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Call Type <span className="text-destructive">*</span>
                </Label>
                <Select value={callType} onValueChange={setCallType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select call type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound (Receive Calls)</SelectItem>
                    <SelectItem value="outbound">Outbound (Make Calls)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

             {/* Language Dropdown */}
<div className="space-y-2">
  <Label>
    Language <span className="text-destructive">*</span>
  </Label>
  <Select value={language} onValueChange={setLanguage}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select language" />
    </SelectTrigger>
    <SelectContent>
      {loadingLanguages ? (
        <SelectItem value="loading" disabled>Loading...</SelectItem>
      ) : languagesOptions.map(lang => (
        <SelectItem key={lang.id} value={lang.id}>
          {lang.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

{/* Voice Dropdown */}
<div className="space-y-2">
  <Label>
    Voice <span className="text-destructive">*</span>
  </Label>
  <Select value={voice} onValueChange={setVoice}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select voice" />
    </SelectTrigger>
    <SelectContent>
      {loadingVoices ? (
        <SelectItem value="loading" disabled>Loading...</SelectItem>
      ) : voicesOptions.map(v => (
        <SelectItem key={v.id} value={v.id}>
          <div className="flex justify-between items-center">
            <span>{v.name}</span>
            <Badge variant="secondary">{v.tag}</Badge>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

           
{/* Prompt Dropdown */}
<div className="space-y-2">
  <Label>
    Prompt <span className="text-destructive">*</span>
  </Label>
  <Select value={prompt} onValueChange={setPrompt}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select prompt" />
    </SelectTrigger>
    <SelectContent>
      {loadingPrompts ? (
        <SelectItem value="loading" disabled>Loading...</SelectItem>
      ) : promptsOptions.map(p => (
        <SelectItem key={p.id} value={p.id}>
          {p.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


          {/* Model Dropdown */}
<div className="space-y-2">
  <Label>
    Model <span className="text-destructive">*</span>
  </Label>
  <Select value={model} onValueChange={setModel}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select model" />
    </SelectTrigger>
    <SelectContent>
      {loadingModels ? (
        <SelectItem value="loading" disabled>Loading...</SelectItem>
      ) : modelsOptions.map(m => (
        <SelectItem key={m.id} value={m.id}>
          {m.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latency ({latency[0].toFixed(1)}s)</Label>
                  <Slider
                    value={latency}
                    onValueChange={setLatency}
                    min={0.3}
                    max={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.3s</span>
                    <span>1.0s</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Speed ({speed[0]}%)</Label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={90}
                    max={130}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>90%</span>
                    <span>130%</span>
                  </div>
                </div>
              </div>

            </div>
          </CollapsibleSection>

          {/* Section 2: Call Script */}
          <CollapsibleSection
            title="Call Script"
            description="What would you like the AI agent to say during the call?"
          >
            <div className="space-y-2">
              <Textarea
                placeholder="Write your call script here..."
                value={callScript}
                onChange={(e) => setCallScript(e.target.value)}
                rows={6}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {callScript.length}/20000
              </p>
            </div>
          </CollapsibleSection>

          {/* Section 4: Service/Product Description */}
          <CollapsibleSection
            title="Service/Product Description"
            description="Add a knowledge base about your service or product."
          >
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your service or product..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                rows={6}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {serviceDescription.length}/20000
              </p>
            </div>
          </CollapsibleSection>

          {/* Section 5: Reference Data */}
          <CollapsibleSection
            title="Reference Data"
            description="Enhance your agent's knowledge base with uploaded files."
          >
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  Drag & drop files here, or{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepted: .pdf, .doc, .docx, .txt, .csv, .xlsx, .xls
                </p>
              </div>

              {/* File list */}
              {uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {uploadedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm truncate">{f.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatFileSize(f.size)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => removeFile(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <FileText className="h-10 w-10 mb-2" />
                  <p className="text-sm">No Files Available</p>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Section 6: Tools */}
          <CollapsibleSection
            title="Tools"
            description="Tools that allow the AI agent to perform call-handling actions and manage session control."
          >
            <FieldGroup className="w-full">
              <FieldLabel htmlFor="switch-hangup">
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldTitle>Allow hang up</FieldTitle>
                    <FieldDescription>
                      Select if you would like to allow the agent to hang up the call
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="switch-hangup" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="switch-callback">
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldTitle>Allow callback</FieldTitle>
                    <FieldDescription>
                      Select if you would like to allow the agent to make callbacks
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="switch-callback" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="switch-transfer">
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldTitle>Live transfer</FieldTitle>
                    <FieldDescription>
                      Select if you want to transfer the call to a human agent
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="switch-transfer" />
                </Field>
              </FieldLabel>
            </FieldGroup>
          </CollapsibleSection>

        </div>

        {/* Right Column — Sticky Test Call Card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Test Call
                </CardTitle>
                <CardDescription>
                  Make a test call to preview your agent. Each test call will
                  deduct credits from your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="test-first-name">First Name</Label>
                      <Input
                        id="test-first-name"
                        placeholder="John"
                        value={testFirstName}
                        onChange={(e) => setTestFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-last-name">Last Name</Label>
                      <Input
                        id="test-last-name"
                        placeholder="Doe"
                        value={testLastName}
                        onChange={(e) => setTestLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={testGender} onValueChange={setTestGender}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <PhoneInput
                      defaultCountry="EG"
                      value={testPhone}
                      onChange={(value) => setTestPhone(value)}
                      placeholder="Enter phone number"
                    />
                  </div>

                <Button className="w-full" onClick={handleTestCall}>
  <Phone className="mr-2 h-4 w-4" />
  Start Test Call
</Button>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-background px-6 py-4">
        <div className="flex justify-end">
<Button onClick={handleSaveWithValidation }>{saveLabel}</Button>
        </div>
      </div>
    </div>
  );
}

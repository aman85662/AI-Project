"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import  EntryForm  from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: initialContent?.contactInfo || {},
      summary: initialContent?.summary || "",
      skills: initialContent?.skills || "",
      experience: initialContent?.experience || [],
      education: initialContent?.education || [],
      projects: initialContent?.projects || [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumefn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  // When initial content is provided, switch to preview tab
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change and active tab is edit
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab, initialContent]);

  // Handle save result feedback
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>\n\n<div align="center">\n${parts.join(
          " | "
        )}\n</div>`
      : "";
  };

  const entriesToSection = (entries, title) => {
    return entries && entries.length > 0
      ? `## ${title}\n\n${entriesToMarkdown(entries, title)}`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToSection(experience, "Work Experience"),
      entriesToSection(education, "Education"),
      entriesToSection(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

const generatePDF = async () => {
  setIsGenerating(true);
  try {
    const html2pdf = (await import("html2pdf.js")).default; // dynamically import only on client

    const element = document.getElementById("resume-pdf");
    const opt = {
      margin: [15, 15],
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation error:", error);
  } finally {
    setIsGenerating(false);
  }
};


  const onSubmit = async (data) => {
    try {
      // Format the preview content if needed
      const formattedContent = previewContent
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();
      console.log("Preview Content:", previewContent, formattedContent);
      await saveResumefn(formattedContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 md:flex-row flex-col gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button variant="destructive" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="Enter your email"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-600">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="Enter your mobile number"
                    error={errors.contactInfo?.mobile}
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-600">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">LinkedIn</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="Enter your LinkedIn profile URL"
                    error={errors.contactInfo?.linkedin}
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-600">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">GitHub</label>
                  <Input
                    {...register("contactInfo.github")}
                    type="url"
                    placeholder="Enter your GitHub profile URL"
                    error={errors.contactInfo?.github}
                  />
                  {errors.contactInfo?.github && (
                    <p className="text-sm text-red-600">
                      {errors.contactInfo.github.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                control={control}
                name="summary"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter your professional summary"
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-600">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                control={control}
                name="skills"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter your skills"
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-600">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                control={control}
                name="experience"
                render={({ field }) => (
                  <EntryForm type="experience" entries={field.value} onChange={field.onChange} />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                control={control}
                name="education"
                render={({ field }) => (
                  <EntryForm type="education" entries={field.value} onChange={field.onChange} />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-600">{errors.education.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                control={control}
                name="projects"
                render={({ field }) => (
                  <EntryForm type="projects" entries={field.value} onChange={field.onChange} />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-600">{errors.projects.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Save Resume
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="link"
              type="button"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          </div>
          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ResumeBuilder;
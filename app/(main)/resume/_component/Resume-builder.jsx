"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Save } from "lucide-react"
import { use, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resumeSchema } from "@/app/lib/schema"
import useFetch from "@/hooks/use-fetch"
import { saveResume } from "@/actions/resume"
import { set } from "date-fns"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import EntryForm from "./entry-form"

function ResumeBuilder({initialContent}) {
  const [activeTab, setActiveTab] = useState('edit');
  
    const { control, register, handleSubmit, watch, formState: { errors }, } = useForm(
        {
            resolver: zodResolver(resumeSchema),
            defaultValues: {
                contactInfo: initialContent?.contactInfo || {},
                summary: initialContent?.summary || '',
                skills: initialContent?.skills || '',
                experience: initialContent?.experience || [],
                education: initialContent?.education || [],
                projects: initialContent?.projects || []
            },
        }
    );
    const { loading: isSaving, fn: saveResumefn, data: saveResult, error: saveError, } = useFetch(saveResume);

    const formValues = watch();
    useEffect(() => { 
        if(initialContent) setActiveTab('preview');
    }, [initialContent]);
  
  const onSubmit = async (data) => { };

    return (
      <div  className="space-y-4">
          <div className="flex items-center justify-between mb-6 md:flex-row flex-col gap-2">
              <h1 className="font-bold gradient-title text-5xl md:text-6xl">Resume Builder</h1>
              <div className="space-x-2">
                  <Button varient="destructive"><Save className="h-4 w-4" />Save</Button>
                   <Button><Download className="h-4 w-4"/>Download PDF</Button>
              </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="edit">Account</TabsTrigger>
    <TabsTrigger value="preview">Password</TabsTrigger>
  </TabsList>
          <TabsContent value="edit">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit())}>
                 <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-4">
                <label className="text-sm font-medium">Email</label>
                <Input {...register("contactInfo.email")} type="email" placeholder="Enter your email"
                  error={errors.contactInfo?.email} />

                { errors.contactInfo?.email && (
                  <p className="text-sm text-red-600">{errors.contactInfo.email.message}</p>
                )}

                </div>
                
                <div className="space-y-4">
                <label className="text-sm font-medium">Mobile Number</label>
                <Input {...register("contactInfo.mobile")} type="tel" placeholder="Enter your mobile number"
                  error={errors.contactInfo?.mobile} />

                { errors.contactInfo?.mobile && (
                  <p className="text-sm text-red-600">{errors.contactInfo.mobile.message}</p>
                )}

                </div>
                
                <div className="space-y-4">
                <label className="text-sm font-medium">LinkedIn</label>
                <Input {...register("contactInfo.linkedin")} type="url" placeholder="Enter your LinkedIn profile URL"
                  error={errors.contactInfo?.linkedin} />

                { errors.contactInfo?.linkedin && (
                  <p className="text-sm text-red-600">{errors.contactInfo.linkedin.message}</p>
                )}

                </div>
                
                <div className="space-y-4">
                <label className="text-sm font-medium">GitHub</label>
                <Input {...register("contactInfo.github")} type="url" placeholder="Enter your GitHub profile URL"
                  error={errors.contactInfo?.github} />

                { errors.contactInfo?.github && (
                  <p className="text-sm text-red-600">{errors.contactInfo.github.message}</p>
                )}
                </div>
              </div>
              </div>
              <div className="space-y-4">
                   <h3>Professional Summary</h3>
                   <Controller
                     control={control}
                     name="summary"
                     render={({ field }) => (
                       <Textarea {...field} placeholder="Enter your professional summary"
                         error={errors.summary} />
                     )}
                   />

                   { errors.summary && (
                     <p className="text-sm text-red-600">{errors.summary.message}</p>
                   )}
              </div>

               <div className="space-y-4">
                   <h3 className="text-lg font-medium">Skills</h3>
                   <Controller
                     control={control}
                     name="skills"
                     render={({ field }) => (
                       <Textarea {...field} placeholder="Enter your skills"
                         error={errors.summary} />
                     )}
                   />

                   { errors.skills && (
                     <p className="text-sm text-red-600">{errors.skills.message}</p>
                   )}
              </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-medium">Work Experience</h3>
                   <Controller
                     control={control}
                     name="experience"
                     render={({ field }) => (
                      <EntryForm  type="experience" entries={field.value} onChange={field.onChange} />
                     )}
                   />

                   { errors.experience && (
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

                   { errors.education && (
                     <p className="text-sm text-red-600">{errors.education.message}</p>
                   )}
              </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-medium">Project</h3>
                   <Controller
                     control={control}
                     name="projects"
                     render={({ field }) => (
                      <EntryForm type="projects" entries={field.value} onChange={field.onChange} />
                     )}
                   />

                   { errors.projects && (
                     <p className="text-sm text-red-600">{errors.projects.message}</p>
                   )}
              </div>
            </form>
                
  </TabsContent>
  <TabsContent value="preview">Change your password here.</TabsContent>
</Tabs>
    </div>
  )
}

export default ResumeBuilder
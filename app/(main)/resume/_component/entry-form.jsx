"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, X, Loader2, Sparkles } from "lucide-react"
import { entrySchema } from "@/app/lib/schema"
import useFetch from "@/hooks/use-fetch"
import { improveWithAI } from "@/actions/resume"
import { parse, format } from "date-fns"
import { toast } from "sonner"

const formatDisplayDate = (dateString) => {
  if (!dateString) return ""
  const date = parse(dateString, "yyyy-MM", new Date())
  return format(date, "MMM yyyy")
}

const EntryForm = ({ type, entries, onChange }) => {
  const [isAdding, setIsAdding] = useState(false)

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organisation: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  })

  const current = watch("current")

  const {
    loading: isImproving,
    fn: improvewithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI)

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent)
      toast.success("Description improved successfully!")
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description")
    }
  }, [improvedContent, improveError, isImproving, setValue])

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    }

    onChange([...entries, formattedEntry])
    reset()
    setIsAdding(false)
  })

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index)
    onChange(newEntries)
  }

  const handleImproveDescription = async () => {
    const description = watch("description")
    if (!description) {
      toast.error("Please enter a description first")
      return
    }

    await improvewithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organisation}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input placeholder="Title" {...register("title")} error={errors.title} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Input placeholder="Organisation" {...register("organisation")} error={errors.organisation} />
                {errors.organisation && <p className="text-red-500">{errors.organisation.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input placeholder="Start Date" type="month" {...register("startDate")} error={errors.startDate} />
                {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="End Date"
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  error={errors.endDate}
                />
                {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                checked={current}
                onChange={(e) => {
                  setValue("current", e.target.checked)
                  if (e.target.checked) setValue("endDate", "")
                }}
              />
              <label htmlFor="current" className="ml-2">
                Currently {type}
              </label>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                className="h-32"
                rows={3}
                {...register("description")}
                error={errors.description}
              />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setIsAdding(false)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button className="w-full" onClick={() => setIsAdding(true)} variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  )
}

export default EntryForm
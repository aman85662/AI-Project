"use client"


import { entrySchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

const EntryForm = ({ type, entries, onChange }) => {
    const [isAdding, setIsAdding] = React.useState(false);

    const { register, handleSubmit: handleValidation, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: zodResolver(entrySchema), defaultValues: {
            title: "",
            organisation: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
     }
    })
    const current = watch("current");
    return (
        <div>
            {isAdding && (
                <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
           )}

            {!isAdding && (
                <Button className ="w-full" onClick={() => setIsAdding(true)} variant="outline">
                 <PlusCircle className='h-4 w-4 mr-2' />
                    Add {type}
                </Button>
            )}
    </div>
  )
}

export default EntryForm
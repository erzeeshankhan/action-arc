// this is the componnet for creating sprints in the project page
"use client";

import { createSprint } from '@/action/sprints';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { Calendar1Icon } from 'lucide-react';


import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker';
import { Controller, useForm } from 'react-hook-form';
import "react-day-picker/dist/style.css";
import useFetch from '@/hooks/use-fetch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { sprintSchema } from '@/app/lib/validators';

const SprintCraetionForm = ({
    projectTitle,
    projectId,
    projectKey,
    sprintKey
}) => {

    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
    // setting the end date of the sprint to 14 days from now
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 14),
    })

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: zodResolver(sprintSchema),
        defaultValues: {
            name: `${projectKey} - ${sprintKey}`,
            startDate: dateRange.from,
            endDate: dateRange.to,
        }
    })

    const { loading: createSprintLoading, fn: createSprintFn } = useFetch(createSprint);

    const onSubmit = async (data) => {
        await createSprintFn(projectId, {
            ...data,
            startDate: dateRange.from,
            endDate: dateRange.to,
        });
        setShowForm(false);
        toast.success('Sprint Created Successfully');
        router.refresh();
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold mb-8 gradient-title'>{projectTitle}</h1>
                <Button
                    className='mt-2'
                    onClick={() => setShowForm(!showForm)}
                    variant={showForm ? 'destructive' : 'default'}
                >{showForm ? 'Cancel' : 'Create New Sprint'}</Button>
            </div>

            {showForm &&
                <Card className='p-5 mb-4'>
                    <CardContent>
                        <form className='flex gap-4 items-end'  onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex-1">
                                <label
                                    htmlFor="name"
                                    className='block text-sm font-medium'
                                >
                                    Sprint Name
                                </label>
                                <Input
                                    className="bg-slate-950 mt-3"
                                    id="name"
                                    readOnly
                                    {...register('name')}
                                />
                                {errors.name && <span>{errors.name.message}</span>}
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="name"
                                    className='block text-sm font-medium'
                                >
                                    Sprint Duration
                                </label>

                                <Controller

                                    control={control}
                                    name="dateRange"
                                    render={({ field }) => {
                                        return (

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full justify-start text-left font-normal bg-slate-950 ${!dateRange && "text-muted-foreground"}`}>
                                                        <Calendar1Icon className=' h-4 w-4' />
                                                        {/* rendering the date range */}
                                                        {dateRange.from && dateRange.to ? (
                                                            format(dateRange.from, 'LLL dd, yyyy') + ' - ' + format(dateRange.to, 'LLL dd, yyyy')
                                                        ) : (<span>Select Date Range</span>)}
                                                    </Button>
                                                </PopoverTrigger>
                                                {/* when clicked on the pop over triggers the pop over content/panel */}
                                                <PopoverContent className="w-auto bg-slate-900 p-4" align="start">
                                                    <DayPicker
                                                        mode='range'
                                                        selected={dateRange}
                                                        onSelect={(range) => {
                                                            if (range.to && range.from) {
                                                                setDateRange(range)
                                                                field.onChange({
                                                                    target: {
                                                                        name: 'dateRange',
                                                                        value: range
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                        classNames={{
                                                            chevron: "fill-blue-800",
                                                            range_start: "bg-blue-800",
                                                            range_end: "bg-blue-800",
                                                            range_middle: "bg-blue-800",
                                                            day_button: "border-none",
                                                            today: "border-2 border-blue-700",
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )

                                    }}
                                />


                            </div>
                            <Button type="submit" disabled={createSprintLoading}>
                                {createSprintLoading ? "Creating..." : "Create Sprint"}
                                
                            </Button>

                        </form>

                    </CardContent>
                </Card>
            }
        </>
    )
}

export default SprintCraetionForm
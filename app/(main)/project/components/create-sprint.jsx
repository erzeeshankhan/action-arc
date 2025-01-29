// this is the componnet for creating sprints in the project page
"use client";

import { createSprint } from '@/action/sprints';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';


import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

const SprintCraetionForm = ({
    projectTitle,
    projectId,
    projectKey,
    sprintKey
}) => {

    const [showForm, setShowForm] = useState(false);

    // setting the end date of the sprint to 14 days from now
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 14),
    })

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: zodResolver(createSprint),
        defaultValues: {
            name: '${projectKey} - ${sprintKey}',
            startDate: dateRange.from,
            endDate: dateRange.to,
        }
    })

    return (
        <>
            <div className="">
                <h1>{projectTitle}</h1>
                <Button
                    className='mt-2'
                    onClick={() => setShowForm(!showForm)}
                    variant={showForm ? 'destructive' : 'default'}
                >{showForm ? 'Cancel' : 'Create New Sprint'}</Button>
            </div>

            {showForm &&
                <Card>
                    <CardContent>
                        <form>
                            <div className="">
                                <label htmlFor="name">Sprint Name</label>
                                <Input
                                    className="bg-slate-950"
                                    id="name"
                                    readOnly
                                    {...register('name')}
                                />
                                {errors.name && <span>{errors.name.message}</span>}
                            </div>
                        </form>

                    </CardContent>
                </Card>}
        </>
    )
}

export default SprintCraetionForm
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useState } from "react";

import React from 'react'

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
    //   for current sprint we wld need status of the sprint 
    // we need it to determine if u are supposed to start the sprint or not
    const [status, setStatus] = useState(sprint.status);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    // to decide if the sprint can start right now or not 
    const canStart =
        isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

    // to decide if the sprint can be ended right now or not
    const canEnd = status === "ACTIVE";

    // handle the sprint change 
    const handleSprintChange = (value) => {
        // finding the selected sprint in the sprint list 
        const selectedSprint = sprints.find((s) => s.id === value);

        // setting the selected sprint and its status
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
    }

    // function to determine if the sprint is active or not (if sprint is started or planned or ended)
    const getStatusText = () => {
        if (status === "COMPLETED") {
            return `Sprint Ended`;
        }
        if (status === "ACTIVE" || isAfter(now, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate, "d")}`;
        }
        if (status === "PLANNED" || isBefore(now, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate, "d")}`;
        }
        return null;

    }

    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <Select value={sprint.id} onValueChange={handleSprintChange}>
                    <SelectTrigger className="bg-slate-900 self-start">
                        <SelectValue placeholder="Select Sprint " />
                    </SelectTrigger>
                    <SelectContent>
                        {sprints.map((sprint) => {
                            return <SelectItem key={sprint.id} value={sprint.id}>
                                {sprint.name} ({format(sprint.startDate, "MMM d, yyy")}) to{" "}
                                {format(sprint.endDate, "MMM d, yyy")}
                            </SelectItem>
                        })}
                    </SelectContent>
                </Select>

                {/* rendering the buttons for start and ending of teh sprints */}
                {canStart && (
                    <Button className='bg-green-900 text-white'>Start Sprint</Button>
                )}

                {/* can end btn will show only if the sprint is started */}
                {canEnd && (
                    <Button className='destructive'>End Sprint</Button>
                )}

            </div>
            {getStatusText() && (
                <Badge className='mt-3  self-start'>{getStatusText()}</Badge>
            )}
        </>
    )
}

export default SprintManager
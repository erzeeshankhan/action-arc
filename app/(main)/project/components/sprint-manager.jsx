"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    return (
        <>
            <div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>

            </div>
        </>
    )
}

export default SprintManager
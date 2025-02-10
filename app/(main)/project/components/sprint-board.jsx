"use client";

import React, { useState } from 'react'
import SprintManager from './sprint-manager';

const SprintBoard = ({ sprints, projectId, orgId }) => {

    // Fetching the sprints from the project 
    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
    );

    return (
        <div>
            {/* Sprint Manager compo */}

            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />


            {/* Kanban Board */}


        </div>
    )
}

export default SprintBoard
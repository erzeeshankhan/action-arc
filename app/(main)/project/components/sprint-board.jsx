"use client";

import React, { useState } from 'react'
import SprintManager from './sprint-manager';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { statuses } from '@/data/status';

const SprintBoard = ({ sprints, projectId, orgId }) => {

    // Fetching the sprints from the project 
    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
    );

    const onDragEnd = () => {

    };

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

            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg'>

                    {statuses.map((column) => (
                        <Droppable key={column.key} droppableId={column.key}>
                            {(provided) => {
                                return
                                <div>
                                    <h3>{column.name}</h3>
                                </div>
                            }}
                        </Droppable>

                    ))}



                    {/* zone 2 */}
                    <Droppable>

                    </Droppable>

                    {/* zone 3 */}
                    <Droppable>

                    </Droppable>

                    {/* zone 4 */}
                    <Droppable>

                    </Droppable>

                </div>
            </DragDropContext>
        </div>
    )
}

export default SprintBoard
"use client";

import React, { useEffect, useState } from 'react'
import SprintManager from './sprint-manager';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import statuses from "@/data/status.json";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import IssueCreationDrawer from './create-issue';
import useFetch from '@/hooks/use-fetch';
import { getIssuesForSprint } from '@/action/issues';
import { BarLoader } from 'react-spinners';

const SprintBoard = ({ sprints, projectId, orgId }) => {

    // Fetching the sprints from the project 
    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
    );

    const handleAddIssue = (status) => {
        setSelectedStatus(status);
        setIsDrawerOpen(true);
    };

    const onDragEnd = () => {

    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const {
        loading: issuesLoading,
        error: issuesError,
        fn: fetchIssues,
        data: issues,
        setData: setIssues,
    } = useFetch(getIssuesForSprint);

    const [filteredIssues, setFilteredIssues] = useState(issues);

    useEffect(() => {
        if (currentSprint.id) {
            fetchIssues(currentSprint.id);
        }
    }, [currentSprint.id]);


    const handleIssueCreated = (issue) => {
        // fetch issues here 
        fetchIssues(currentSprint.id);
    }

    if (issuesError) return <div>Error loading issues</div>;

    return (
        <div>
            {/* Sprint Manager compo */}

            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />

            {issuesLoading && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}


            {/* Kanban Board */}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg'>

                    {statuses.map((column) => (
                        <Droppable key={column.key} droppableId={column.key}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                                    <h3 className='font-semibold mb-2 text-center'>{column.name}</h3>


                                    {/* Issues */}


                                    {provided.placeholder}


                                    {/* Create issue button */}
                                    {column.key === "TODO" && currentSprint.status !== "COMPLETED" &&
                                        <Button
                                            variant='ghost'
                                            className='w-full'
                                            onClick={() => {
                                                // Create Issue
                                                handleAddIssue(column.key);
                                            }}
                                        >
                                            <Plus className='mr-2 h-4 w-4' />
                                            Create Issue
                                        </Button>
                                    }

                                </div>
                            )}
                        </Droppable>
                    ))}



                </div>
            </DragDropContext>

            <IssueCreationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={currentSprint.id}
                status={selectedStatus}
                projectId={projectId}
                onIssueCreated={handleIssueCreated}
                orgId={orgId}
            />
        </div>
    )
}

export default SprintBoard
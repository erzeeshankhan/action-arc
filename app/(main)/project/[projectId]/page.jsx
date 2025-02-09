"use server";

import { getProject } from '@/action/projects';
import { notFound } from 'next/navigation';
import React from 'react'
import SprintCreationForm from '../components/create-sprint';
import SprintBoard from '../components/sprint-board';

export default async function ProjectPage({ params }) {

  const { projectId } = params;

  // Fetch the project data by projectId
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }


  return (
    <div className='container mx-auto'>
      {/* Sprint creation component */}

      <SprintCreationForm
        projectTitle={project.name}
        projectId={project.id}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}

      />


      {/* Sprint Board (all the issues things will be here) */}
      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={project.id}
          orgId={project.organizationId}
        />


      ) : (
        <div className='text-center text-muted-foreground p-5'><span>No Sprints found, create sprint from button above</span></div>
      )}


    </div>
  )
}


"use server"


import { getProject } from '@/action/projects';
import { notFound } from 'next/navigation';
import React from 'react'

const ProjectPage = async ({ params }) => {

    const { projectId } = params;

    // Fetch the project data by projectId
    const project = await getProject(projectId);

    if (!project ){
      notFound();
    }


  return (
    <div>ProjectPage</div>
  )
}

export default ProjectPage
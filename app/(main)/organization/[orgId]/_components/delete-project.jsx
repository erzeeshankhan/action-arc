// This page contains the delete project component. The delete project component is used to delete the project. The delete project component is used in the project list component

"use client";

import { deleteProject } from '@/action/projects';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { useOrganization } from '@clerk/nextjs';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const DeleteProject = ({ projectId }) => {

    const router = useRouter();


    // Fetch the project data to delete
    const {
        loading: isDeleting,
        error,
        data: deleted,
        fn: deleteProjectFn,
    } = useFetch(deleteProject);
    
    // handle delete function to confirm the deletion
    const handleDelete = () => {

        if(window.confirm('Are you sure you want to delete this project?')){
            deleteProjectFn(projectId);
        }
    }

    // if project is deleted successfully then show the message
    useEffect(() => {
        if (deleted?.success) {
            toast.success("Project deleted successfully");
            router.refresh();
        }
    }, [deleted]);

    // Taking userId from auth()
    const { membership } = useOrganization();

    // check if the user is admin of the organization
    const isAdmin = membership?.role === "org:admin";

    // if user is not admin then return the message
    if (!isAdmin) {
        return <div>Only organization admins can delete projects</div>;
    }


    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className={`${isDeleting ? "animate-pulse" : ""}`}
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {/* trash can icon */}
                <Trash2 className="h-4 w-4" />
            </Button>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </>
    )
}

export default DeleteProject
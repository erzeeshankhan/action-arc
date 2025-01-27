"use client";

import { Button } from '@/components/ui/button';
import { useOrganization } from '@clerk/nextjs';
import { Trash2 } from 'lucide-react';
import React from 'react'

const DeleteProject = ({ projectId }) => {
    
    // Taking userId from auth()
    const {membership} = useOrganization();

    // check if the user is admin of the organization
    const isAdmin = membership?.role === "org:admin";

    // if user is not admin then return the message
    if (!isAdmin) {
        return <div>Only organization admins can delete projects</div>;
    }


    return (
        <>
            <Button variant="ghost">
                <Trash2 className='h-4 w-4' size={16} />
            </Button>
        </>
    )
}

export default DeleteProject
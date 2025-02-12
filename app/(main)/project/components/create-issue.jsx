"use client";

import { createIssue } from "@/action/issues";
import { getOrganizationUsers } from "@/action/organization";
import { issueSchema } from "@/app/lib/validators";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";

const IssueCreationDrawer = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    orgId,
    onIssueCreated,
}) => {


    // 
    const{
        loading: createIssueLoading,
        fn: createIssueFn,
        error,
        data: newIssue,
    } = useFetch(createIssue)
    
    // 
    const{
        loading: userLoading,
        fn: fetchUsers,
        data: users,
    } = useFetch(getOrganizationUsers)

    // onsubmit function 
    const onSubmit = async (data) =>{}

    // create issue form 
    const { 
        control, 
        register, 
        handleSubmit,
        formState: { errors },
     } = useForm({

        resolver: zodResolver(issueSchema),

    })

    useEffect(() => {
        if (isOpen && orgId){
            fetchUsers(orgId);
        }
      
    }, [isOpen, orgId])
    


    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Issue</DrawerTitle>
                </DrawerHeader>
                {userLoading && <BarLoader width={"100%"} color="#36d7b7"/> }
            </DrawerContent>
        </Drawer>

    )
}

export default IssueCreationDrawer;
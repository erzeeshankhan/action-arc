"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
// import { createProject } from "@/actions/projects";
// import { BarLoader } from "react-spinners";
import OrgSwitcher from "@/components/org-switcher";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";




const CreateProjectPage = () => {

    // Using react hook form with use Form hook
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectSchema),
    });


    // Check if the user is admin or not 
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    // making an isadmin state to mainteain and check in other places too that user is admin or not 
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            setIsAdmin(membership.role === "org:admin");
        }
        //if these three things change, the useEffect will get called again
    }, [isOrgLoaded, isUserLoaded, membership])

    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col gap-2 items-center">
                <span className="text-2xl gradient-title">
                    Oops! Only Admins can create projects.
                </span>
                <OrgSwitcher />
            </div>
        );
    }

    // an empty form to pass in to the handleSubmit in below form
    const onSubmit = async () => {


    }

    // Form for creating project 
    return (
        <div className="container mx-auto py-10">
            <h1>Create New Project</h1>
            <div className="">

                <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Input for name */}
                    <div className="name">
                        <Input
                            id='name'
                            className='bg-slate-850'
                            placeholder='Project Name'
                            // this will tell hook form that this input field belongs to the name field of the schema
                            {...register("name")}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Input for Key */}
                    <div className="key">
                        <Input
                            id='key'
                            className='bg-slate-850'
                            placeholder='Project Key (Ex: ARCT)'
                            // this will tell hook form that this input field belongs to the Key field of the schema
                            {...register("key")}
                        />
                        {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>}
                    </div>

                    {/* Input for Description */}
                    <div className="description">
                        <Textarea
                            id='description'
                            className='bg-slate-850'
                            placeholder='Description'
                            // this will tell hook form that this input field belongs to the Description field of the schema
                            {...register("description")}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <Button type="submit" size="lg" className="bg-blue-950 text-white  ">
                        Submit
                    </Button>
                </form>
            </div>
        </div>

    )
}

export default CreateProjectPage
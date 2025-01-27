"use client"

// This is Create Project Page



import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/app/lib/validators";
import { BarLoader } from "react-spinners";
import OrgSwitcher from "@/components/org-switcher";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject } from "@/action/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";




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
    const router = useRouter();

    //admin check
    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            const adminStatus = membership.role === "org:admin";
            setIsAdmin(adminStatus);
            if (!adminStatus) {
                toast.error("You must be an admin to create a project.");
            }
        }
    }, [isOrgLoaded, isUserLoaded, membership]);

    // calling api to create project
    const {
        loading,
        error,
        data: project,
        fn: createProjectFn,
    } = useFetch(createProject);

    // an empty form to pass in to the handleSubmit in below form
    const onSubmit = async (data) => {
        if (!isAdmin) {
            alert("Only organization admins can create projects");
            return;
        }

        createProjectFn(data);
    };


    // After project is created, route the user to created project page via project id
    useEffect(() => {
        if (project) {
            router.push(`/project/${project.id}`);
            toast.success("Project created successfully");
        }
    }, [loading]);


    // 
    if (!isOrgLoaded || !isUserLoaded) {
        return <div className="text-center">Loading...</div>;
    }

    // 
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


    // Form for creating project 
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
                Create New Project
            </h1>


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
                {loading && (
                    <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                )}
                <Button disabled={loading} type="submit" size="lg" className={`bg-blue-950 text-gray-500 w-60 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {/* If loading is true it says creating pr if not it says create pr */}
                    {loading ? "Creating..." : "Create Project"}
                </Button>
                {error && <p className="text-red-500 text-sm mt-2">{error?.message || "An unexpected error occurred."}</p>}

            </form>
        </div>

    )
}

export default CreateProjectPage
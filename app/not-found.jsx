"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the path to your button component
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFound = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/");
    };

    return (
        <div className="flex notfound-main items-center justify-center h-screen text-white">
            <div className="text-center ">
                <Image
                className="mx-5"
                    src="/404.svg"
                    alt="404 Illustration"
                    width={400} // Set appropriate width
                    height={250} // Set appropriate height
                />
                {/* <h1 className="text-6xl font-extrabold mb-4 text-primary">404</h1> */}
                <p className="text-xl text-muted-foreground mt-4 mb-6">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <Button variant="default" size="lg" onClick={handleGoHome}>
                    Go Back Home
                </Button>
            </div>
        </div>
    );
};

export default NotFound;

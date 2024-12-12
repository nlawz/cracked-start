"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (!error) return null;

    return error === "email_exists" ? (
        <Alert variant="destructive" className="rounded-none rounded-t-lg border-x-0 border-t-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
                {message || "An error occurred during sign in"}
            </AlertDescription>
        </Alert>
    ) : null;
}

"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Modal({
    title,
    children,
    open,
    onOpenChange,
    }: {
    title: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-2xl">
            <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
        </DialogContent>
        </Dialog>
    );
}

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "@/types/appwrite.types";

interface Props {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
}

function AppointmentModal(props: Props) {
  const { type, userId, appointment, patientId } = props;
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} - Appointment</DialogTitle>
          <DialogDescription>
            Por favor sigue los detalles del agendamiento {type}
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm 
            userId={userId}
            patientId={patientId}
            type={type}
            appointment={appointment!}
            setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentModal;

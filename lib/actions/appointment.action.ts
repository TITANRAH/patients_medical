"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams,
  userId: string
) => {
  console.log(appointment.primaryPhysician);
  console.log(formatDateTime(
    appointment.schedule!
  ))

  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

   

    const smsMessage = `Hola, esto es un mensaje del sitio de agendamiento ${`Tu cita ha sido agendada para el ${formatDateTime(
      appointment.schedule!
    ).dateTime}`} con el doctor ${appointment.primaryPhysician}`;
    await sendSMSNotification(userId, smsMessage);
    console.log(APPOINTMENT_COLLECTION_ID);
    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        console.log(appointment.status);
        switch (appointment.status) {
          case "schedule":
            console.log("entro aca");
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    console.log(data);

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updateAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updateAppointment) {
      throw new Error("Appointment not found");
    }

    // sms notificacion

    const smsMessage = `Hola, esto es un mensaje del sitio de agendamiento ${
      type === "schedule"
        ? `Tu cita ha sido reagendada para el ${formatDateTime(
            appointment.schedule!
          ).dateTime} con el doctor ${appointment.primaryPhysician}`
        : `Informamos que tu cita ha sido cancelada por la siguiente razón ${appointment.cancellationReason}`
    }`;
    await sendSMSNotification(userId, smsMessage);
    revalidatePath("/admin");
    return parseStringify(updateAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};

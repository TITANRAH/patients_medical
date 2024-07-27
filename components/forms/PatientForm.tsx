"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone-input",
  CHECKBOX = "checkbox",
  DATE_PICKER = "date-picker",
  SELECT = "select",
  SKELETON = "skeleton",
}

function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {

    console.log('entro a la funcion onsbmit');
    
    setIsLoading(true);

    try {
      const userData = {
        name,
        email,
        phone,
      };

      const user = await createUser(userData);
      console.log(user);
      

      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y4">
          <h1 className="header">Hola! aquí</h1>
          <p className="text-dark-700">Agenda tu primera cita </p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="full name"
          placeholder="Sergio Miranda"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="granrah1@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="user"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone number"
          placeholder="(569) 555-5555"
          iconSrc="/assets/icons/email.svg"
          iconAlt="user"
        />

        <SubmitButton isLoading={isLoading}>Comenzar</SubmitButton>
      </form>
    </Form>
  );
}

export default PatientForm;

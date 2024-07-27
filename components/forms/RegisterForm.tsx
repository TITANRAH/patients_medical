"use client";

import { Form, FormControl } from "@/components/ui/form";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SelectItem } from "../ui/select";
import FileUpload from "../FileUpload";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone-input",
  CHECKBOX = "checkbox",
  DATE_PICKER = "date-picker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface Props {
  user: User;
}

function RegisterForm(props: Props) {
  const { user } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  //   como no es creacion enviaremos un puro objeto con todas las variables por que es
  //   modificacion
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    console.log("entro a la funcion onsbmit");

    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      
      // @ts-ignore
      const newPatient = await registerPatient(patientData)

      console.log(newPatient)

      if(newPatient){
        router.push(`/patients/${user.$id}/new-appointment`)
      }

      
    } catch (error) {
      
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="space-y-4">
          <h1 className="header">Bienvenido</h1>
          <p className="text-dark-700">Let us know more about yourself. </p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          placeholder="Sergio Miranda"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            label="Date of Birth"
            name="birthDate"
            iconSrc="/assets/icons/email.svg"
            iconAlt="Date of birth"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex gap-6 h-11 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((o) => (
                    <div key={o} className="radio-group">
                      <RadioGroupItem value={o} id={o} />

                      <Label htmlFor={o} className="cursor-pointer">
                        {o}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information</h2>
          </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="14th Street New York"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Enginer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardians name"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(569) 1234567"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information</h2>
          </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a physician"
          >
            {Doctors.map((d) => (
              <SelectItem key={d.name} value={d.name}>
                <div className="flex cursor-pointer items-center mb-2 mt-2  gap-4">
                  <Image
                    src={d.image}
                    width={32}
                    height={32}
                    alt={d.name}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{d.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC1234567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergias (de haber)"
            placeholder="Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current Medication (de haber)"
            placeholder="Ibuprofen 200mg, Paracetamol"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mather had brain cancer..."
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendecitomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification</h2>
          </div>
        </section>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification Type"
            placeholder="Identification Type"
          >
            {IdentificationTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456890"
          />
        </div>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name="identificationDocument"
          label="Scanned copy of identificacion document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUpload files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="treatmentConsent"
          label="estoy consiente del tratamiento"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="disclosureConsent"
          label="estoy consiente de la info"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          name="privacyConsent"
          label="estoy consiente de la privaidad"
        />

        <SubmitButton isLoading={isLoading}>Comenzar</SubmitButton>
      </form>
    </Form>
  );
}

export default RegisterForm;

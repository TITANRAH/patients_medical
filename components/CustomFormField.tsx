"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import { E164Number } from "libphonenumber-js/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

interface PropsForm {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

function CustomFormField(props: PropsForm) {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} propsForm={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
}

interface PropsRenderField {
  field: any;
  propsForm: PropsForm;
}

const RenderField = (props: PropsRenderField) => {
  const { field, propsForm } = props;
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
    children,
    disabled,
    name,
    label
  } = propsForm;

  const [value, setValue] = useState();

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className="ml-2"
            />
          )}

          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0  w-full"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="CL"
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value as E164Number | undefined}
          onChange={field.onChange}
          className="input-phone "
        />
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md  border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            alt={""}
            height={24}
            width={24}
            className="ml-2"
          />

          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "dd/MM/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent className="shad-select-content gap-2">
              {children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            {...field}
            className="shad-textArea"
            placeholder={placeholder}
            disabled={disabled}
          ></Textarea>
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
         <div className="flex items-center gap-4">
          <Checkbox
          id={name}
          checked={field.value}
          onCheckedChange={field.onChange}
          />

          <label htmlFor={name} className="checkbox-label">
            {label}
          </label>
         </div>
        </FormControl>
      );
    default:
      break;
  }
};

export default CustomFormField;

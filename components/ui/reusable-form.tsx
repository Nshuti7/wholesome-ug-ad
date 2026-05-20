// components/ui/reusable-form.tsx
"use client";

import * as React from "react";
import { useForm, FieldValues, Path, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  CalendarIcon,
  Loader2,
  Upload,
  X,
  Eye,
  Download,
  Plus,
  Minus,
  Star,
  Clock,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
// @ts-expect-error: No type definitions for lodash
import { isEqual } from "lodash";

// Extended field types
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "switch"
  | "radio"
  | "date"
  | "datetime"
  | "time"
  | "file"
  | "multifile"
  | "image"
  | "multiimage"
  | "range"
  | "rating"
  | "color"
  | "tags"
  | "json"
  | "rich-text"
  | "array"
  | "object"
  | "conditional"
  | "group"
  | "separator"
  | "hidden";

// Base field configuration
export interface BaseField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: z.ZodTypeAny;
}

// Specific field configurations
export interface SelectField extends BaseField {
  type: "select";
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export interface MultiSelectField extends BaseField {
  type: "multiselect";
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  maxSelections?: number;
}

export interface RadioField extends BaseField {
  type: "radio";
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  orientation?: "horizontal" | "vertical";
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
  defaultChecked?: boolean;
}

export interface SwitchField extends BaseField {
  type: "switch";
  defaultChecked?: boolean;
}

export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface RangeField extends BaseField {
  type: "range";
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
}

export interface RatingField extends BaseField {
  type: "rating";
  maxRating?: number;
  allowHalf?: boolean;
}

export interface FileField extends BaseField {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
}

export interface MultiFileField extends BaseField {
  type: "multifile";
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  showPreview?: boolean;
}

export interface ImageField extends BaseField {
  type: "image";
  accept?: string;
  maxSize?: number; // in MB
  showPreview?: boolean;
  dimensions?: { width?: number; height?: number };
}

export interface MultiImageField extends BaseField {
  type: "multiimage";
  accept?: string;
  maxFiles?: number;
  minFiles?: number;
  maxSize?: number; // in MB
  showPreview?: boolean;
  dimensions?: { width?: number; height?: number };
}

export interface TagsField extends BaseField {
  type: "tags";
  suggestions?: string[];
  maxTags?: number;
  allowCustom?: boolean;
}

export interface ArrayField extends BaseField {
  type: "array";
  itemField: FormField;
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
}

export interface ObjectField extends BaseField {
  type: "object";
  fields: FormField[];
}

export interface ConditionalField extends BaseField {
  type: "conditional";
  condition: {
    field: string;
    operator: "equals" | "not-equals" | "contains" | "greater" | "less";
    value: any;
  };
  field: FormField;
}

export interface GroupField extends BaseField {
  type: "group";
  fields: FormField[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface SeparatorField extends Omit<BaseField, "name"> {
  type: "separator";
  name?: string;
}

export interface HiddenField extends BaseField {
  type: "hidden";
  value: any;
}

export type FormField =
  | BaseField
  | SelectField
  | MultiSelectField
  | RadioField
  | CheckboxField
  | SwitchField
  | NumberField
  | RangeField
  | RatingField
  | FileField
  | MultiFileField
  | ImageField
  | MultiImageField
  | TagsField
  | ArrayField
  | ObjectField
  | ConditionalField
  | GroupField
  | SeparatorField
  | HiddenField;

export interface ReusableFormProps<T extends FieldValues> {
  fields: FormField[];
  onSubmit: (data: T) => void | Promise<void>;
  validationSchema?: z.ZodTypeAny; // <-- allow any ZodType
  defaultValues?: Partial<T>;
  submitButtonText?: string;
  submitButtonClassName?: string;
  formClassName?: string;
  isLoading?: boolean;
  resetOnSubmit?: boolean;
  children?: React.ReactNode;
  mode?: "onChange" | "onBlur" | "onSubmit";
  onFormChange?: (data: Partial<T>) => void;
}

// File preview component
const FilePreview: React.FC<{
  file: File;
  onRemove: () => void;
  showPreview?: boolean;
}> = ({ file, onRemove, showPreview = true }) => {
  const [preview, setPreview] = React.useState<string>("");

  React.useEffect(() => {
    if (showPreview && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, showPreview]);

  return (
    <Card className="relative p-2">
      <CardContent className="p-2">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={file.name}
              className="w-full h-20 object-cover rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span className="text-sm truncate max-w-[150px]">
                {file.name}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      </CardContent>
    </Card>
  );
};

// Rating component
const RatingInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
  allowHalf?: boolean;
  disabled?: boolean;
}> = ({
  value,
  onChange,
  maxRating = 5,
  allowHalf = false,
  disabled = false,
}) => {
  const [hover, setHover] = React.useState(0);

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={cn(
              "focus:outline-none",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => !disabled && onChange(ratingValue)}
            onMouseEnter={() => !disabled && setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={cn(
                "h-5 w-5",
                (hover || value) >= ratingValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

// Tags input component
const TagsInput: React.FC<{
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  allowCustom?: boolean;
  placeholder?: string;
}> = ({
  value = [],
  onChange,
  suggestions = [],
  maxTags,
  allowCustom = true,
  placeholder = "Add tags...",
}) => {
  const [input, setInput] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag) && (!maxTags || value.length < maxTags)) {
      onChange([...value, tag]);
      setInput("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(suggestion)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              if (allowCustom) addTag(input.trim());
            }
          }}
          placeholder={placeholder}
          disabled={maxTags ? value.length >= maxTags : false}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export function ReusableForm<T extends FieldValues>({
  fields,
  onSubmit,
  validationSchema,
  defaultValues,
  submitButtonText = "Submit",
  submitButtonClassName,
  formClassName,
  isLoading = false,
  resetOnSubmit = false,
  children,
  mode = "onSubmit",
  onFormChange,
}: ReusableFormProps<T>) {
  const form = useForm<T>({
    resolver: validationSchema
      ? zodResolver(validationSchema as z.ZodTypeAny)
      : undefined,
    defaultValues: defaultValues as any,
    mode,
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        form.reset();
      }
    } catch (error) {
      // Handle form submission error silently
    }
  };

  const watchedValues = form.watch();

  // Notify parent of form value changes ONLY if changed
  const prevValuesRef = React.useRef<any>(watchedValues);
  React.useEffect(() => {
    if (onFormChange && !isEqual(watchedValues, prevValuesRef.current)) {
      onFormChange(watchedValues);
      prevValuesRef.current = watchedValues;
    }
  }, [watchedValues, onFormChange]);

  const shouldShowField = (field: FormField): boolean => {
    if (field.type !== "conditional") return true;

    const condField = field as ConditionalField;
    const {
      field: fieldName,
      operator,
      value: condValue,
    } = condField.condition;
    const fieldValue = watchedValues[fieldName];

    switch (operator) {
      case "equals":
        return fieldValue === condValue;
      case "not-equals":
        return fieldValue !== condValue;
      case "contains":
        return Array.isArray(fieldValue) && fieldValue.includes(condValue);
      case "greater":
        return Number(fieldValue) > Number(condValue);
      case "less":
        return Number(fieldValue) < Number(condValue);
      default:
        return true;
    }
  };

  const renderField = (
    field: FormField,
    index: number
  ): React.JSX.Element | null => {
    // Handle separator
    if (field.type === "separator") {
      const sepField = field as SeparatorField;
      return (
        <div
          key={`separator-${index}`}
          className={cn("my-4", sepField.className)}
        >
          <Separator />
          {sepField.label && (
            <div className="text-sm text-muted-foreground mt-2 text-center">
              {sepField.label}
            </div>
          )}
        </div>
      );
    }

    // Handle conditional fields
    if (field.type === "conditional") {
      const condField = field as ConditionalField;
      if (!shouldShowField(field)) return null;
      return renderField(condField.field, index);
    }

    // Handle group fields
    if (field.type === "group") {
      const groupField = field as GroupField;
      const [isCollapsed, setIsCollapsed] = React.useState(
        groupField.defaultCollapsed ?? false
      );

      return (
        <div
          key={field.name || `group-${index}`}
          className={cn("space-y-4 p-4 border rounded-lg", field.className)}
        >
          <div
            className={cn(
              "flex items-center justify-between",
              groupField.collapsible && "cursor-pointer"
            )}
            onClick={() =>
              groupField.collapsible && setIsCollapsed(!isCollapsed)
            }
          >
            <h3 className="text-lg font-medium">{field.label}</h3>
            {groupField.collapsible && (
              <Button type="button" variant="ghost" size="sm">
                {isCollapsed ? (
                  <Plus className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          {(!groupField.collapsible || !isCollapsed) && (
            <div className="space-y-4">
              {groupField.fields.map((subField, subIndex) =>
                renderField(subField, subIndex)
              )}
            </div>
          )}
        </div>
      );
    }

    // Handle hidden fields
    if (field.type === "hidden") {
      const hiddenField = field as HiddenField;
      return (
        <Controller
          key={field.name}
          name={field.name as Path<T>}
          control={form.control}
          defaultValue={hiddenField.value}
          render={() => <></>}
        />
      );
    }

    const commonProps = {
      control: form.control,
      name: field.name as Path<T>,
      disabled: field.disabled || isLoading,
    };

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "tel":
      case "url":
      case "search":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...formField}
                    value={formField.value || ""}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "number":
        const numberField = field as NumberField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={field.placeholder}
                    min={numberField.min}
                    max={numberField.max}
                    step={numberField.step}
                    {...formField}
                    value={formField.value || ""}
                    onChange={(e) => formField.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={field.placeholder} 
                    {...formField} 
                    value={formField.value || ""}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "select":
        const selectField = field as SelectField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={formField.value || ""}
                  disabled={formField.disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectField.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectField.options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "multiselect":
        const multiSelectField = field as MultiSelectField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {multiSelectField.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${field.name}-${option.value}`}
                          checked={
                            Array.isArray(formField.value) &&
                            formField.value.includes(option.value)
                          }
                          onCheckedChange={(checked) => {
                            const currentValue = Array.isArray(formField.value)
                              ? formField.value
                              : [];
                            if (checked) {
                              if (
                                !multiSelectField.maxSelections ||
                                currentValue.length <
                                  multiSelectField.maxSelections
                              ) {
                                formField.onChange([
                                  ...currentValue,
                                  option.value,
                                ]);
                              }
                            } else {
                              formField.onChange(
                                currentValue.filter(
                                  (v: string) => v !== option.value
                                )
                              );
                            }
                          }}
                          disabled={option.disabled}
                        />
                        <Label htmlFor={`${field.name}-${option.value}`}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "radio":
        const radioField = field as RadioField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    value={formField.value || ""}
                    className={cn(
                      "flex space-y-1",
                      radioField.orientation === "horizontal"
                        ? "flex-row space-x-4 space-y-0"
                        : "flex-col"
                    )}
                  >
                    {radioField.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          disabled={option.disabled}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        const checkboxField = field as CheckboxField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem
                className={cn(
                  "flex flex-row items-start space-x-3 space-y-0",
                  field.className
                )}
              >
                <FormControl>
                  <Checkbox
                    checked={Boolean(formField.value)}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "switch":
        const switchField = field as SwitchField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem
                className={cn(
                  "flex flex-row items-center justify-between rounded-lg border p-4",
                  field.className
                )}
              >
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{field.label}</FormLabel>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(formField.value)}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "range":
        const rangeField = field as RangeField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel className="flex justify-between">
                  {field.label}
                  {rangeField.showValue && (
                    <span className="text-sm text-muted-foreground">
                      {formField.value || rangeField.min}
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Slider
                    min={rangeField.min}
                    max={rangeField.max}
                    step={rangeField.step || 1}
                    value={[formField.value || rangeField.min]}
                    onValueChange={(value: number[]) =>
                      formField.onChange(value[0])
                    }
                    className="w-full"
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "rating":
        const ratingField = field as RatingField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <RatingInput
                    value={formField.value || 0}
                    onChange={formField.onChange}
                    maxRating={ratingField.maxRating}
                    allowHalf={ratingField.allowHalf}
                    disabled={formField.disabled}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "color":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      {...formField}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formField.value || "#000000"}
                      onChange={formField.onChange}
                      placeholder="#000000"
                      className="font-mono"
                    />
                  </div>
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "date":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={cn("flex flex-col", field.className)}>
                <FormLabel>{field.label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(formField.value, "PPP")
                        ) : (
                          <span>{field.placeholder || "Pick a date"}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value}
                      onSelect={formField.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "datetime":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...formField}
                    value={
                      formField.value
                        ? new Date(formField.value).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      formField.onChange(new Date(e.target.value))
                    }
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "time":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input type="time" {...formField} />
                  </div>
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "file":
        const fileField = field as FileField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={fileField.accept}
                    multiple={fileField.multiple}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        // Check file size
                        const maxSize = (fileField.maxSize || 10) * 1024 * 1024; // Convert MB to bytes
                        const validFiles = Array.from(files).filter(
                          (file) => file.size <= maxSize
                        );
                        if (validFiles.length !== files.length) {
                          // Some files exceed size limit
                        }
                        formField.onChange(
                          fileField.multiple ? validFiles : validFiles[0]
                        );
                      }
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "multifile":
        const multiFileField = field as MultiFileField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => {
              const files = Array.isArray(formField.value)
                ? formField.value
                : [];

              return (
                <FormItem className={field.className}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept={multiFileField.accept}
                        multiple
                        onChange={(e) => {
                          const newFiles = e.target.files;
                          if (newFiles) {
                            const maxSize =
                              (multiFileField.maxSize || 10) * 1024 * 1024;
                            const maxFiles = multiFileField.maxFiles || 10;

                            let validFiles = Array.from(newFiles).filter(
                              (file) => file.size <= maxSize
                            );

                            if (files.length + validFiles.length > maxFiles) {
                              validFiles = validFiles.slice(
                                0,
                                maxFiles - files.length
                              );
                            }

                            formField.onChange([...files, ...validFiles]);
                          }
                          // Reset input
                          e.target.value = "";
                        }}
                      />

                      {files.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {files.map((file: File, index: number) => (
                            <FilePreview
                              key={`${file.name}-${index}`}
                              file={file}
                              showPreview={multiFileField.showPreview}
                              onRemove={() => {
                                const updatedFiles = files.filter(
                                  (_: File, i: number) => i !== index
                                );
                                formField.onChange(updatedFiles);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );

      case "image":
        const imageField = field as ImageField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept={imageField.accept || "image/*"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const maxSize =
                            (imageField.maxSize || 5) * 1024 * 1024;
                          if (file.size <= maxSize) {
                            formField.onChange(file);
                          }
                        }
                      }}
                    />

                    {formField.value && imageField.showPreview && (
                      <div className="max-w-xs">
                        <FilePreview
                          file={formField.value}
                          showPreview={true}
                          onRemove={() => formField.onChange(null)}
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "multiimage":
        const multiImageField = field as MultiImageField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => {
              const images = Array.isArray(formField.value)
                ? formField.value
                : [];
              const minFiles = multiImageField.minFiles || 0;
              const maxFiles = multiImageField.maxFiles || 10;
              const isMinMet = images.length >= minFiles;

              return (
                <FormItem className={field.className}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept={multiImageField.accept || "image/*"}
                        multiple
                        onChange={(e) => {
                          const newImages = e.target.files;
                          if (newImages) {
                            const maxSize =
                              (multiImageField.maxSize || 5) * 1024 * 1024;

                            let validImages = Array.from(newImages).filter(
                              (file) =>
                                file.type.startsWith("image/") &&
                                file.size <= maxSize
                            );

                            if (images.length + validImages.length > maxFiles) {
                              validImages = validImages.slice(
                                0,
                                maxFiles - images.length
                              );
                            }

                            formField.onChange([...images, ...validImages]);
                          }
                          e.target.value = "";
                        }}
                      />

                      {/* File count indicator */}
                      <div className="text-sm text-muted-foreground">
                        {images.length} of {maxFiles} images selected
                        {minFiles > 0 && (
                          <span className={isMinMet ? "text-green-600" : "text-red-600"}>
                            {" "}(minimum {minFiles} required)
                          </span>
                        )}
                      </div>

                      {images.length > 0 && multiImageField.showPreview && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {images.map((image: File, index: number) => (
                            <FilePreview
                              key={`${image.name}-${index}`}
                              file={image}
                              showPreview={true}
                              onRemove={() => {
                                const updatedImages = images.filter(
                                  (_: File, i: number) => i !== index
                                );
                                formField.onChange(updatedImages);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Minimum files warning */}
                      {minFiles > 0 && !isMinMet && images.length > 0 && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          Please upload at least {minFiles} images. Currently: {images.length}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );

      case "tags":
        const tagsField = field as TagsField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <TagsInput
                    value={formField.value || []}
                    onChange={formField.onChange}
                    suggestions={tagsField.suggestions}
                    maxTags={tagsField.maxTags}
                    allowCustom={tagsField.allowCustom}
                    placeholder={field.placeholder}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "json":
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className={field.className}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder || "Enter valid JSON"}
                    value={
                      formField.value
                        ? JSON.stringify(formField.value, null, 2)
                        : ""
                    }
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        formField.onChange(parsed);
                      } catch {
                        // Keep the string value for now, validation will catch it
                        formField.onChange(e.target.value);
                      }
                    }}
                    className="font-mono text-sm"
                    rows={6}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "array":
        const arrayField = field as ArrayField;
        return (
          <FormField
            key={field.name}
            {...commonProps}
            render={({ field: formField }) => {
              const items = Array.isArray(formField.value)
                ? formField.value
                : [];

              return (
                <FormItem className={field.className}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {items.map((_, index: number) => (
                        <div key={index} className="flex items-end gap-2">
                          <div className="flex-1">
                            {renderField(
                              {
                                ...arrayField.itemField,
                                name: `${field.name}.${index}`,
                              },
                              index
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItems = items.filter(
                                (_: any, i: number) => i !== index
                              );
                              formField.onChange(newItems);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            !arrayField.maxItems ||
                            items.length < arrayField.maxItems
                          ) {
                            const newItems = [...items, ""];
                            formField.onChange(newItems);
                          }
                        }}
                        disabled={
                          arrayField.maxItems
                            ? items.length >= arrayField.maxItems
                            : false
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {arrayField.addButtonText || "Add Item"}
                      </Button>
                    </div>
                  </FormControl>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", formClassName)}
      >
        {fields.map((field, index) => renderField(field, index))}
        {children}
        <Button
          type="submit"
          disabled={isLoading}
          className={submitButtonClassName}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Uploading..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

// Enhanced schema creation helper
export const createFormSchema = <T extends Record<string, any>>(
  fields: FormField[]
): z.ZodSchema<T> => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  const processField = (field: FormField): z.ZodTypeAny => {
    if (field.validation) {
      return field.validation;
    }

    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "url":
        fieldSchema = z.string().url("Invalid URL");
        break;
      case "number":
        const numField = field as NumberField;
        fieldSchema = z.number();
        if (numField.min !== undefined)
          fieldSchema = (fieldSchema as z.ZodNumber).min(numField.min);
        if (numField.max !== undefined)
          fieldSchema = (fieldSchema as z.ZodNumber).max(numField.max);
        break;
      case "range":
        const rangeField = field as RangeField;
        fieldSchema = z.number().min(rangeField.min).max(rangeField.max);
        break;
      case "rating":
        const ratingField = field as RatingField;
        fieldSchema = z
          .number()
          .min(0)
          .max(ratingField.maxRating || 5);
        break;
      case "textarea":
      case "text":
      case "password":
      case "tel":
      case "search":
        fieldSchema = z.string();
        break;
      case "checkbox":
      case "switch":
        fieldSchema = z.boolean();
        break;
      case "date":
      case "datetime":
        fieldSchema = z.date();
        break;
      case "time":
        fieldSchema = z
          .string()
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format");
        break;
      case "file":
      case "image":
        fieldSchema = z.any(); // File objects
        break;
      case "multifile":
      case "multiimage":
        fieldSchema = z.array(z.any());
        break;
      case "multiselect":
      case "tags":
        const multiField = field as MultiSelectField | TagsField;
        fieldSchema = z.array(z.string());
        if ("maxSelections" in multiField && multiField.maxSelections) {
          fieldSchema = (fieldSchema as z.ZodArray<any>).max(
            multiField.maxSelections
          );
        }
        if ("maxTags" in multiField && multiField.maxTags) {
          fieldSchema = (fieldSchema as z.ZodArray<any>).max(
            multiField.maxTags
          );
        }
        break;
      case "color":
        fieldSchema = z
          .string()
          .regex(/^#[0-9A-F]{6}$/i, "Invalid color format");
        break;
      case "json":
        fieldSchema = z.any();
        break;
      case "array":
        const arrayField = field as ArrayField;
        const itemSchema = processField(arrayField.itemField);
        fieldSchema = z.array(itemSchema);
        if (arrayField.minItems)
          fieldSchema = (fieldSchema as z.ZodArray<any>).min(
            arrayField.minItems
          );
        if (arrayField.maxItems)
          fieldSchema = (fieldSchema as z.ZodArray<any>).max(
            arrayField.maxItems
          );
        break;
      case "object":
        const objectField = field as ObjectField;
        const objectSchema: Record<string, z.ZodTypeAny> = {};
        objectField.fields.forEach((subField) => {
          if (subField.name) {
            objectSchema[subField.name] = processField(subField);
          }
        });
        fieldSchema = z.object(objectSchema);
        break;
      case "group":
        const groupField = field as GroupField;
        groupField.fields.forEach((subField) => {
          if (subField.name) {
            schemaObject[subField.name] = processField(subField);
          }
        });
        return z.any(); // Groups don't have their own schema
      case "conditional":
        const condField = field as ConditionalField;
        return processField(condField.field);
      case "separator":
      case "hidden":
        return z.any();
      default:
        fieldSchema = z.string();
    }

    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    } else if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "password" ||
      field.type === "tel" ||
      field.type === "search"
    ) {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      }
    }

    return fieldSchema;
  };

  fields.forEach((field) => {
    if (field.name && field.type !== "group" && field.type !== "separator") {
      schemaObject[field.name] = processField(field);
    }
  });

  return z.object(schemaObject) as unknown as z.ZodSchema<T>;
};

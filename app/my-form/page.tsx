"use client";

import React, { useState } from "react";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ReusableForm,
  createFormSchema,
  type FormField,
} from "@/components/ui/reusable-form";

// Demo form configurations
const basicFormFields: FormField[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
    description: "Your legal first name",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@example.com",
    required: true,
    description: "We'll never share your email with anyone else",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    placeholder: "https://yourwebsite.com",
  },
  {
    name: "bio",
    label: "Biography",
    type: "textarea",
    placeholder: "Tell us about yourself...",
    description: "A brief description of yourself (optional)",
  },
];

const advancedFormFields: FormField[] = [
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { value: "technology", label: "Technology" },
      { value: "design", label: "Design" },
      { value: "marketing", label: "Marketing" },
      { value: "other", label: "Other" },
    ],
    placeholder: "Select a category",
  },
  {
    name: "skills",
    label: "Skills",
    type: "multiselect",
    options: [
      { value: "react", label: "React" },
      { value: "typescript", label: "TypeScript" },
      { value: "nodejs", label: "Node.js" },
      { value: "python", label: "Python" },
      { value: "design", label: "UI/UX Design" },
      { value: "marketing", label: "Digital Marketing" },
    ],
    maxSelections: 3,
    description: "Select up to 3 skills",
  },
  {
    name: "experience",
    label: "Experience Level",
    type: "radio",
    required: true,
    options: [
      { value: "junior", label: "Junior (0-2 years)" },
      { value: "mid", label: "Mid-level (3-5 years)" },
      { value: "senior", label: "Senior (6+ years)" },
    ],
    orientation: "vertical",
  },
  {
    name: "newsletter",
    label: "Subscribe to Newsletter",
    type: "checkbox",
    description: "Get weekly updates about new features and content",
  },
  {
    name: "notifications",
    label: "Push Notifications",
    type: "switch",
    description: "Receive push notifications on your device",
  },
];

const interactiveFormFields: FormField[] = [
  {
    name: "budget",
    label: "Budget Range",
    type: "range",
    min: 1000,
    max: 50000,
    step: 1000,
    showValue: true,
    description: "Select your project budget range",
  },
  {
    name: "rating",
    label: "Rate Our Service",
    type: "rating",
    maxRating: 5,
    allowHalf: false,
    description: "How would you rate our service?",
  },
  {
    name: "favoriteColor",
    label: "Favorite Color",
    type: "color",
    description: "Pick your favorite color",
  },
  {
    name: "birthday",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select your birth date",
  },
  {
    name: "meetingTime",
    label: "Meeting Date & Time",
    type: "datetime",
    description: "When would you like to schedule the meeting?",
  },
  {
    name: "preferredTime",
    label: "Preferred Time",
    type: "time",
    description: "What time works best for you?",
  },
];

const fileFormFields: FormField[] = [
  {
    name: "resume",
    label: "Resume",
    type: "file",
    accept: ".pdf,.doc,.docx",
    maxSize: 5,
    required: true,
    description: "Upload your resume (PDF, DOC, or DOCX, max 5MB)",
  },
  {
    name: "portfolio",
    label: "Portfolio Images",
    type: "multiimage",
    accept: "image/*",
    maxFiles: 5,
    maxSize: 10,
    showPreview: true,
    description: "Upload up to 5 portfolio images",
  },
  {
    name: "profilePicture",
    label: "Profile Picture",
    type: "image",
    maxSize: 2,
    showPreview: true,
    description: "Upload a profile picture (max 2MB)",
  },
  {
    name: "documents",
    label: "Supporting Documents",
    type: "multifile",
    maxFiles: 3,
    maxSize: 5,
    showPreview: true,
    description: "Upload additional documents if needed",
  },
];

const dynamicFormFields: FormField[] = [
  {
    name: "tags",
    label: "Tags",
    type: "tags",
    suggestions: [
      "react",
      "typescript",
      "nextjs",
      "tailwind",
      "nodejs",
      "python",
    ],
    maxTags: 5,
    allowCustom: true,
    placeholder: "Add relevant tags...",
    description: "Add up to 5 tags to categorize your content",
  },
  {
    name: "socialLinks",
    label: "Social Media Links",
    type: "array",
    itemField: {
      name: "link",
      label: "Social Link",
      type: "url",
      placeholder: "https://...",
    },
    minItems: 1,
    maxItems: 5,
    addButtonText: "Add Social Link",
    description: "Add your social media profiles",
  },
  {
    name: "hasExperience",
    label: "Do you have previous experience?",
    type: "checkbox",
  },
  {
    name: "experienceDetails",
    label: "Experience Details",
    type: "conditional",
    condition: {
      field: "hasExperience",
      operator: "equals",
      value: true,
    },
    field: {
      name: "yearsOfExperience",
      label: "Years of Experience",
      type: "number",
      min: 0,
      max: 50,
      required: true,
    },
  },
];

const groupedFormFields: FormField[] = [
  {
    name: "personalInfo",
    label: "Personal Information",
    type: "group",
    collapsible: true,
    defaultCollapsed: false,
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "age",
        label: "Age",
        type: "number",
        min: 18,
        max: 100,
      },
    ],
  },
  {
    type: "separator",
    label: "Contact Information",
  },
  {
    name: "contactInfo",
    label: "Contact Details",
    type: "group",
    collapsible: true,
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
      },
    ],
  },
  {
    name: "preferences",
    label: "Preferences",
    type: "group",
    collapsible: true,
    defaultCollapsed: true,
    fields: [
      {
        name: "theme",
        label: "Theme",
        type: "select",
        options: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" },
        ],
      },
      {
        name: "language",
        label: "Language",
        type: "select",
        options: [
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
        ],
      },
    ],
  },
];

// Form schemas
const basicSchema = createFormSchema(basicFormFields);
const advancedSchema = createFormSchema(advancedFormFields);
const interactiveSchema = createFormSchema(interactiveFormFields);
const fileSchema = createFormSchema(fileFormFields);
const dynamicSchema = createFormSchema(dynamicFormFields);
const groupedSchema = createFormSchema(groupedFormFields);

export default function ComprehensiveFormDemo() {
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (formType: string) => async (data: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmissions((prev) => ({ ...prev, [formType]: data }));
    setIsLoading(false);
  };

  const renderFormSection = (
    title: string,
    description: string,
    fields: FormField[],
    schema: z.ZodSchema<any>,
    formType: string,
    features: string[]
  ) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {features.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ReusableForm
            fields={fields}
            onSubmit={handleSubmit(formType)}
            validationSchema={schema}
            isLoading={isLoading}
            submitButtonText={`Submit ${title}`}
            resetOnSubmit={true}
            mode="onBlur"
          />
        </CardContent>
      </Card>

      {submissions[formType] && (
        <Card>
          <CardHeader>
            <CardTitle>Submission Result</CardTitle>
            <CardDescription>Latest form submission data</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <pre className="text-sm">
                {JSON.stringify(submissions[formType], null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">ReusableForm Component Demo</h1>
        <p className="text-muted-foreground">
          A comprehensive demonstration of all available field types and
          features in the ReusableForm component. This component supports 25+
          field types with built-in validation, conditional rendering, and more.
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
          <TabsTrigger value="grouped">Grouped</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          {renderFormSection(
            "Basic Input Fields",
            "Essential form fields for collecting basic user information with validation.",
            basicFormFields,
            basicSchema,
            "basic",
            ["Text Input", "Email", "URL", "Phone", "Textarea", "Validation"]
          )}
        </TabsContent>

        <TabsContent value="advanced">
          {renderFormSection(
            "Advanced Selection Fields",
            "Advanced form controls for complex data selection and user preferences.",
            advancedFormFields,
            advancedSchema,
            "advanced",
            [
              "Select",
              "Multi-select",
              "Radio",
              "Checkbox",
              "Switch",
              "Validation Limits",
            ]
          )}
        </TabsContent>

        <TabsContent value="interactive">
          {renderFormSection(
            "Interactive Controls",
            "Interactive form elements including sliders, ratings, color pickers, and date/time inputs.",
            interactiveFormFields,
            interactiveSchema,
            "interactive",
            [
              "Range Slider",
              "Star Rating",
              "Color Picker",
              "Date",
              "DateTime",
              "Time",
            ]
          )}
        </TabsContent>

        <TabsContent value="files">
          {renderFormSection(
            "File Upload Fields",
            "File upload capabilities with support for single/multiple files, images, and previews.",
            fileFormFields,
            fileSchema,
            "files",
            [
              "File Upload",
              "Multi-file",
              "Image Upload",
              "File Preview",
              "Size Limits",
              "Type Validation",
            ]
          )}
        </TabsContent>

        <TabsContent value="dynamic">
          {renderFormSection(
            "Dynamic & Conditional Fields",
            "Dynamic form behavior with conditional fields, tags, arrays, and smart form logic.",
            dynamicFormFields,
            dynamicSchema,
            "dynamic",
            [
              "Tags Input",
              "Dynamic Arrays",
              "Conditional Fields",
              "Auto-suggestions",
              "Smart Logic",
            ]
          )}
        </TabsContent>

        <TabsContent value="grouped">
          {renderFormSection(
            "Grouped & Organized Fields",
            "Organize forms with collapsible groups, separators, and structured layouts.",
            groupedFormFields,
            groupedSchema,
            "grouped",
            [
              "Collapsible Groups",
              "Field Separators",
              "Nested Structure",
              "Organization",
              "Clean Layout",
            ]
          )}
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Available Field Types</CardTitle>
          <CardDescription>
            Complete list of all supported field types in the ReusableForm
            component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              "text",
              "email",
              "password",
              "number",
              "tel",
              "url",
              "search",
              "textarea",
              "select",
              "multiselect",
              "checkbox",
              "switch",
              "radio",
              "date",
              "datetime",
              "time",
              "file",
              "multifile",
              "image",
              "multiimage",
              "range",
              "rating",
              "color",
              "tags",
              "json",
              "array",
              "object",
              "conditional",
              "group",
              "separator",
              "hidden",
            ].map((type) => (
              <Badge key={type} variant="outline" className="justify-center">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Features & Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Form Features</h4>
              <ul className="space-y-2 text-sm">
                <li>• Built-in validation with Zod</li>
                <li>• TypeScript support</li>
                <li>• Responsive design</li>
                <li>• Loading states</li>
                <li>• Custom styling</li>
                <li>• Form reset options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Field Capabilities</h4>
              <ul className="space-y-2 text-sm">
                <li>• Conditional field rendering</li>
                <li>• Dynamic arrays and objects</li>
                <li>• File upload with previews</li>
                <li>• Rich validation rules</li>
                <li>• Custom field descriptions</li>
                <li>• Accessibility support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

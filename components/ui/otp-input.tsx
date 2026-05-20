// components/ui/otp-input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function OTPInput({
  value,
  onChange,
  length = 4,
  disabled = false,
  className,
  placeholder,
  autoFocus = false,
}: OTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(
    Array(length)
      .fill("")
      .map((_, i) => value?.[i] || "")
  );
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when value prop changes
  React.useEffect(() => {
    const newOtp = Array(length)
      .fill("")
      .map((_, i) => value?.[i] || "");
    setOtp(newOtp);
  }, [value, length]);

  // Focus first input on mount if autoFocus is true
  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (val: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Call onChange with the joined string
    onChange(newOtp.join(""));

    // Auto-focus next input if current input is filled
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty, move to previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      const newOtp = Array(length)
        .fill("")
        .map((_, i) => digits[i] || "");
      setOtp(newOtp);
      onChange(newOtp.join(""));

      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={cn("flex justify-center gap-3", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-12 h-12 text-center text-xl font-semibold",
            "border-2 rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // Default styling
            "border-gray-300 text-gray-900",
            "focus:border-[#30b264] focus:ring-[#30b264]",
            // Filled state
            otp[index] && "border-[#30b264] bg-green-50",
            // Error state (you can add this via className prop)
            disabled && "bg-gray-100"
          )}
        />
      ))}
    </div>
  );
}

// For use with ReusableForm, you can add this to the reusable-form.tsx file
// Add this to the FieldType union:
// | "otp"

// Add this interface:
// export interface OTPField extends BaseField {
//   type: "otp";
//   length?: number;
//   autoFocus?: boolean;
// }

// Add this case to the switch statement in renderField:
// case "otp":
//   const otpField = field as OTPField;
//   return (
//     <FormField
//       key={field.name}
//       {...commonProps}
//       render={({ field: formField }) => (
//         <FormItem className={field.className}>
//           <FormLabel>{field.label}</FormLabel>
//           <FormControl>
//             <OTPInput
//               value={formField.value || ""}
//               onChange={formField.onChange}
//               length={otpField.length}
//               disabled={formField.disabled}
//               autoFocus={otpField.autoFocus}
//             />
//           </FormControl>
//           {field.description && (
//             <FormDescription>{field.description}</FormDescription>
//           )}
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );

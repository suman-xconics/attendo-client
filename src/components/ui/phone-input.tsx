"use client";
import { useState, forwardRef, useEffect } from "react";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { CircleFlag } from "react-circle-flags";
import { lookup } from "country-data-list";
import { z } from "zod";
import { GlobeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const phoneSchema = z.string().refine((value) => {
  try {
    return isValidPhoneNumber(value);
  } catch {
    return false;
  }
}, "Invalid phone number");

export type CountryData = {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
};

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCountryChange?: (data: CountryData | undefined) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultCountry?: string;
  fixedCountry?: string;
  className?: string;
  inline?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      onCountryChange,
      onChange,
      value,
      placeholder,
      defaultCountry,
      fixedCountry,
      inline = false,
      ...props
    },
    ref
  ) => {
    const [countryData, setCountryData] = useState<CountryData | undefined>();
    const [displayFlag, setDisplayFlag] = useState<string>("");
    const [hasInitialized, setHasInitialized] = useState(false);

    // Use fixedCountry if provided, otherwise use defaultCountry
    const effectiveCountry = fixedCountry || defaultCountry;

    useEffect(() => {
      if (effectiveCountry) {
        const newCountryData = lookup.countries({
          alpha2: effectiveCountry.toLowerCase(),
        })[0];
        setCountryData(newCountryData);
        setDisplayFlag(effectiveCountry.toLowerCase());

        if (
          !hasInitialized &&
          newCountryData?.countryCallingCodes?.[0] &&
          !value
        ) {
          const syntheticEvent = {
            target: {
              value: newCountryData.countryCallingCodes[0],
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange?.(syntheticEvent);
          setHasInitialized(true);
        }
      }
    }, [effectiveCountry, onChange, value, hasInitialized]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // Ensure the value starts with "+"
      if (!newValue.startsWith("+")) {
        if (newValue.startsWith("00")) {
          newValue = "+" + newValue.slice(2);
        } else {
          newValue = "+" + newValue;
        }
      }

      try {
        // If fixedCountry is provided, parse with that country as default
        const parsed = fixedCountry
          ? parsePhoneNumber(newValue, fixedCountry.toUpperCase() as any)
          : parsePhoneNumber(newValue);

        if (parsed) {
          // If fixedCountry is set, validate that the parsed number matches the fixed country
          if (fixedCountry) {
            const fixedCountryUpper = fixedCountry.toUpperCase();
            
            // Only accept numbers that match the fixed country
            if (parsed.country === fixedCountryUpper) {
              const syntheticEvent = {
                ...e,
                target: {
                  ...e.target,
                  value: parsed.number,
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange?.(syntheticEvent);
            } else {
              // If country doesn't match, just pass the raw value
              // This allows typing but won't format until it's valid for the fixed country
              onChange?.(e);
            }
          } else {
            // Normal behavior when no fixedCountry
            if (parsed.country) {
              const countryCode = parsed.country;
              setDisplayFlag(countryCode.toLowerCase());

              const countryInfo = lookup.countries({ alpha2: countryCode })[0];
              setCountryData(countryInfo);
              onCountryChange?.(countryInfo);

              const syntheticEvent = {
                ...e,
                target: {
                  ...e.target,
                  value: parsed.number,
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange?.(syntheticEvent);
            } else {
              onChange?.(e);
              setDisplayFlag("");
              setCountryData(undefined);
              onCountryChange?.(undefined);
            }
          }
        } else {
          onChange?.(e);
          if (!fixedCountry) {
            setDisplayFlag("");
            setCountryData(undefined);
            onCountryChange?.(undefined);
          }
        }
      } catch (error) {
        onChange?.(e);
        if (!fixedCountry) {
          setDisplayFlag("");
          setCountryData(undefined);
          onCountryChange?.(undefined);
        }
      }
    };

    const containerClasses = cn(
      // Base styles matching Input component
      "flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input-border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow]",
      // Focus styles matching Input component
      "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50",
      // Invalid state
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      // Disabled state
      "has-[input:disabled]:pointer-events-none has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
      // Dark mode
      "dark:bg-input/30",
      inline && "rounded-l-none",
      className
    );

    return (
      <div className={containerClasses}>
        {!inline && (
          <div className="w-4 h-4 rounded-full shrink-0">
            {displayFlag ? (
              <CircleFlag countryCode={displayFlag} height={16} />
            ) : (
              <GlobeIcon size={16} />
            )}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder || "Enter number"}
          type="tel"
          autoComplete="tel"
          name="phone"
          className={cn(
            "flex-1 border-none bg-transparent font-satoshi-regular text-base outline-none transition-colors placeholder:text-muted-foreground selection:bg-muted-foreground selection:text-primary-foreground md:text-sm"
          )}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

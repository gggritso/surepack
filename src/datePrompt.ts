import {
  createPrompt,
  useState,
  useKeypress,
  isEnterKey,
  usePrefix,
  makeTheme,
} from "@inquirer/core";
import { parse, format, isValid } from "date-fns";

interface DatePromptConfig {
  message: string;
  default?: Date;
}

const theme = makeTheme({});

/**
 * Custom date prompt that accepts dates in various formats:
 * - "15 Jan", "Jan 15", "15/Jan", "January 15"
 * - Full dates like "2025-01-15" or "01/15/2025"
 */
export const datePrompt: (config: DatePromptConfig) => Promise<Date> = createPrompt<
  Date,
  DatePromptConfig
>((config, done) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const prefix = usePrefix({ status, theme });

  const parseDate = (dateStr: string): Date | null => {
    const currentYear = new Date().getFullYear();
    const trimmed = dateStr.trim();

    // Try various date formats
    const formats = [
      { pattern: "d MMM", addYear: true },
      { pattern: "MMM d", addYear: true },
      { pattern: "d/MMM", addYear: true },
      { pattern: "MMMM d", addYear: true },
      { pattern: "d MMMM", addYear: true },
      { pattern: "yyyy-MM-dd", addYear: false },
      { pattern: "MM/dd/yyyy", addYear: false },
      { pattern: "dd/MM/yyyy", addYear: false },
    ];

    for (const { pattern, addYear } of formats) {
      const parseStr = addYear ? `${trimmed} ${currentYear}` : trimmed;
      const parsePattern = addYear ? `${pattern} yyyy` : pattern;
      const parsed = parse(parseStr, parsePattern, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    }

    // Try native Date parsing as fallback
    const nativeDate = new Date(trimmed);
    if (isValid(nativeDate)) {
      return nativeDate;
    }

    return null;
  };

  useKeypress((key, rl) => {
    if (isEnterKey(key)) {
      const inputValue = value || (config.default ? format(config.default, "MMM d") : "");
      const parsed = parseDate(inputValue);

      if (parsed) {
        setError(null);
        setStatus("done");
        done(parsed);
      } else {
        setError(`Invalid date: "${inputValue}". Try formats like "15 Jan" or "Jan 15".`);
      }
    } else {
      setValue(rl.line);
      setError(null);
    }
  });

  const defaultHint = config.default ? ` (${format(config.default, "MMM d")})` : "";
  const displayValue = status === "done" ? format(parseDate(value)!, "MMM do, yyyy") : value;

  const prompt = `${prefix} ${config.message}${defaultHint} ${displayValue}`;

  if (error) {
    return [prompt, error];
  }

  return prompt;
});

import { useForm as useReactHookForm, UseFormProps, FieldValues, Path } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseFormOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
    schema?: ZodSchema;
}

/**
 * Custom hook that wraps react-hook-form with Zod validation
 * Provides a simplified API with built-in schema validation support
 */
export function useForm<T extends FieldValues>(options: UseFormOptions<T>) {
    const { schema, ...restOptions } = options;

    const resolver = schema ? zodResolver(schema) : undefined;

    return useReactHookForm<T>({
        ...restOptions,
        resolver,
    });
}

/**
 * Utility function to get field error message
 */
export const getFieldError = (fieldName: string, errors: Record<string, any>): string | undefined => {
    const keys = fieldName.split('.');
    let error = errors;

    for (const key of keys) {
        if (error && typeof error === 'object' && key in error) {
            error = error[key];
        } else {
            return undefined;
        }
    }

    return error?.message || error?.toString();
};

/**
 * Utility function to format form data before submission
 */
export const formatFormData = <T extends FieldValues>(data: T): T => {
    const formatted: any = {};

    for (const key in data) {
        const value = data[key];
        if (value === '') {
            formatted[key] = undefined;
        } else if (typeof value === 'string') {
            formatted[key] = value.trim();
        } else {
            formatted[key] = value;
        }
    }

    return formatted;
};

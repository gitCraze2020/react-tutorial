import React, { InputHTMLAttributes } from 'react';

import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/core';
import { useField } from 'formik';

// adopt all props that a regular input field would take by copying the type.
// then, using &, append an object to it which has a required field 'name',
// so now 'name' is a required attribute
//
// we also added label as additional property
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};

export const InputField: React.FC<InputFieldProps> = ({
      label,
      size: _,
      className,
      ...props }) => {
    // {label, ...props} -- that means taking label off of props, because
    // label cannot be applied to Input, but we are passing props to the Input
    // we will use {label} on FormLabel, though
    // same issue with size, it's available on the Input in a different, conflicting type
    // so it must be stripped off of props. We could just do 'size,' but instead we do a 'size: _,' in other words
    // by renaming it to the field named _, which is a good convention for naming an unused field.
    // anyway the purpose is to take if off of props and pass the rest of props on as object structure
    // Note: className apparently also caused a conflict, so I also removed that from props
    //
    // field 'field' is provided by useField, and it has a bunch of information on it
    // such as name, onBlur, onChange, value, checked?, multiple?
    // and we want to pass on that information to the Input field below
    // so that we can populate its attributes with it, example {field.name}, {field.onChange}
    //
    //the second field 'error' provided by useField can be passed through to the FormControl field
    // notice the double-negated {error}, which means cast to boolean ('if undefined') and then see if that's false
    //
    const [field, {error, }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel
                htmlFor={field.name}>{label}</FormLabel>
            <Input
                {...field}
                {...props}
                value={field.value}
                onChange={field.onChange}
                id={field.name}
            />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
    );
}

export default InputField;

import React, { memo } from 'react';
import { Grid, TextField, TextFieldProps, useTheme } from '@mui/material';

export interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText: string;
  inputProps: TextFieldProps['inputProps'];
  error?: boolean;
}

interface InputFieldsProps {
  fields: InputFieldProps[];
}

/**
 * 入力フィールドのコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns 入力フィールドのコンポーネント
 */
const InputFields: React.FC<InputFieldsProps> = ({ fields }) => {
  const theme = useTheme();
  
  return (
    <Grid container spacing={3}>
      {fields.map((field, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <TextField
            fullWidth
            label={field.label}
            type="number"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            variant="outlined"
            inputProps={field.inputProps}
            helperText={field.helperText}
            error={field.error}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(InputFields); 
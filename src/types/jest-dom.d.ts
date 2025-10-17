import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeVisible(): R
      toBeEmptyDOMElement(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveAccessibleDescription(): R
      toHaveAccessibleErrorMessage(): R
      toHaveAccessibleName(): R
      toHaveAttribute(): R
      toHaveClass(): R
      toHaveFocus(): R
      toHaveFormValues(): R
      toHaveStyle(): R
      toHaveTextContent(): R
      toHaveValue(): R
      toHaveDisplayValue(): R
      toBeChecked(): R
    }
  }
}
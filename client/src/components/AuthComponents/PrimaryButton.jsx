import Button from '../ui/Button'

export default function PrimaryButton({ children, isLoading, ...props }) {
  return (
    <Button
      variant='primary'
      className='login-btn'
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </Button>
  );
}
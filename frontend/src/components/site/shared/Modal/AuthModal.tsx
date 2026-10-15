import React from "react";
interface AuthModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, setOpen, onSuccess }) => {
  return <></>;
};

export default AuthModal;

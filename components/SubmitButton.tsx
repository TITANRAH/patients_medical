import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}
function SubmitButton(props: Props) {
  const { isLoading, className, children } = props;
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />

          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

export default SubmitButton;

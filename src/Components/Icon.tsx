import React, { useEffect, useRef, useState } from "react";

interface UseDynamicSVGImportOptions {
  onCompleted?: (
    name: string,
    SvgIcon: React.FC<React.SVGProps<SVGSVGElement>> | undefined
  ) => void;
  onError?: (err: Error) => void;
}

function useDynamicSVGImport(
  name: string,
  options: UseDynamicSVGImportOptions = {}
) {
  const ImportedIconRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async (): Promise<void> => {
      try {
        ImportedIconRef.current = (
          await import(`./${name}.svg`)
        ).ReactComponent;
        onCompleted?.(name, ImportedIconRef.current);
      } catch (err) {
        onError?.(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  onCompleted?: UseDynamicSVGImportOptions["onCompleted"];
  onError?: UseDynamicSVGImportOptions["onError"];
}

/**
 * Simple wrapper for dynamic SVG import hook. You can implement your own wrapper,
 * or even use the hook directly in your components.
 */
const Icon: React.FC<IconProps> = ({
  name,
  onCompleted,
  onError,
  ...rest
}): React.ReactNode | null => {
  const { error, loading, SvgIcon } = useDynamicSVGImport(name, {
    onCompleted,
    onError
  });
  if (error) {
    return error.message;
  }
  if (loading) {
    return "Loading...";
  }
  if (SvgIcon) {
    return <SvgIcon {...rest} />;
  }
  return null;
};
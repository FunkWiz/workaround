import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <main className="flex justify-center">
      <div className="h-full min-h-screen w-full border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
};

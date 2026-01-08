import { useRouter } from 'next/navigation';
export const ProjectNotFound = ({ t }: { t: any }) => {
 const router = useRouter();
  
  return (
    <div className="max-w-xl mx-auto px-4 pt-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {t("slug.error.title")}
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {t("slug.error.subtitle")}
      </p>
      <div className="mt-8 flex justify-center gap-6">
        <button
          onClick={() => router.push("/")}
          className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {t("slug.back")}
        </button>
      </div>
    </div>
  );
}

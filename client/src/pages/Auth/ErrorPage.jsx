import React from "react";
import { Link} from "react-router-dom"
function ErrorPage() {
  return (
    <div>
      <main className="container grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-white shadow rounded-lg dark:bg-stone-800">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600 dark:text-indigo-300">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-100">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ErrorPage;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Submit() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black dark:text-white">
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      <h1 className="mt-4">Please wait...</h1>
    </div>
  );
}

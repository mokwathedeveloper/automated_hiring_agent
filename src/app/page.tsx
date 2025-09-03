// src/app/page.tsx

import FileUploadForm from '@/components/FileUploadForm';
import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8">
        Automated Hiring Agent
      </h1>
      <FileUploadForm />
    </div>
  );
};

export default HomePage;

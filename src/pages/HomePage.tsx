import React, { useState, useEffect } from "react";
import LoginDialog from '../components/LoginDialog';
import RegisterDialog from '../components/RegisterDialog';

export default function HomePage() {

  return (
    <div>
      <React.Fragment>
        <div className="flex flex-col  h-full w-full  p-8 mt-8">
          <div className="flex flex-col  md:flex-row-reverse h-full w-full">

          </div>
          <div className="flex flex-row flex-wrap gap-1">
          
          </div>
        </div>
        <LoginDialog />
        <RegisterDialog />
      </React.Fragment>
    </div>
  );
}

'use client'
import { titleFont } from '@/config/fonts';
import { LoginForm } from './UI/LoginForm';

export default function loginPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

      <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

      <LoginForm />
    </div>
  );
}
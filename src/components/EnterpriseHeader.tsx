import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import React, { ReactNode } from 'react';
import coactionLogo from '../assets/coaction-logo-darkmode-transparent.png';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface EnterpriseHeaderProps {
  portalName: string;
  pageTitle: string;
  color?: string;
  pageDescription: string;
  breadcrumbs: Breadcrumb[];
  icon?: ReactNode;
}

const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  portalName,
  pageTitle,
  color,
  pageDescription,
  breadcrumbs,
  icon,
}) => {
  return (
    <>
      {/* Top Utility Bar */}
      <div className="w-full bg-blue-950" style={{ minHeight: 32, maxHeight: 36 }}>
        <div className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 h-9 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white/80" />
            <span className="text-xs font-medium text-white/80 tracking-wide opacity-80">Enterprise AI Portal</span>
          </div>
          <span className="text-xs text-white/60 font-light opacity-70 text-right">An Official Coaction Labs Resource</span>
        </div>
      </div>
      {/* Main Header Bar */}
      <div className="w-full bg-[#0A1628]">
        <div className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 flex items-center justify-start">
          <Link to="/" className="rounded-md flex items-center h-24 w-auto justify-start my-1" aria-label="Go to home page">
            <img src={coactionLogo} alt="CO/ACTION Logo" className="h-20 w-auto" />
          </Link>
        </div>
      </div>
      {/* Page Hero Section with Logo on Top */}
      <section className="w-full bg-slate-100 border-b border-slate-200">
        <div className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 pt-3 pb-2 2xl:pt-6 2xl:pb-4 flex flex-col items-start">
          {/* Breadcrumbs */}
          <nav className="mb-1 2xl:mb-2 flex items-center text-xs text-slate-500 gap-1" aria-label="Breadcrumb">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />}
                {bc.href ? (
                  <Link to={bc.href} className="hover:underline text-slate-500">{bc.label}</Link>
                ) : (
                  <span className="font-medium text-slate-700">{bc.label}</span>
                )}
              </span>
            ))}
          </nav>
          {/* Page Title with Icon */}
          <div className="flex items-center gap-3 mb-1">
            {icon && (
              <div className={`flex items-center justify-center w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg ${color || 'bg-indigo-100'}`}>
                {icon}
              </div>
            )}
            <h1 className="text-xl 2xl:text-3xl font-serif font-extrabold text-slate-900 tracking-tight">{pageTitle}</h1>
          </div>
          {/* Description */}
          <p className="text-sm 2xl:text-base text-slate-600 max-w-2xl mb-0">{pageDescription}</p>
        </div>
      </section>
    </>
  );
};

export default EnterpriseHeader;

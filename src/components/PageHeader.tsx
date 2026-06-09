import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
  icon?: ReactNode;
  title: string;
  description: string;
}

const PageHeader = ({ breadcrumbs, icon, title, description }: PageHeaderProps) => {
  return (
    <div className="border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 mb-6">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              {breadcrumb.href ? (
                <Link
                  to={breadcrumb.href}
                  className="text-sm text-slate-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-sm text-slate-900 font-medium">
                  {breadcrumb.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Title and Description */}
        <div className="flex items-start gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-slate-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

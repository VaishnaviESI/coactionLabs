import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Clock, Play, ExternalLink, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleVideos, externalCourses } from '@/data/sampleData';

const Academy = () => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Coursera':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Udemy':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Microsoft Learn':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-background to-blue-50/30">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <Link
          to="/"
          className="group inline-flex items-center mb-4 py-1 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="whitespace-nowrap ml-2 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2 pointer-events-none">
            Back to Dashboard
          </span>
        </Link>
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Academy</h1>
          </div>
          <p className="text-muted-foreground">Learn to write effective queries for insurance AI agents</p>
        </div>

        {/* External Courses Section */}
        <Card className="mb-8 border-blue-100/60 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              External Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalCourses.map((course) => (
                <a
                  key={course.id}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-blue-100 bg-background hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200/60 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <ExternalLink className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getProviderColor(course.provider)} text-xs`}>
                        {course.provider}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground group-hover:text-blue-700 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getLevelColor(course.level)} text-xs shrink-0`}>
                        {course.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Internal Training Videos Section */}
        <Card className="border-blue-100/60 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
              Training Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleVideos.map((video) => (
                <div
                  key={video.id}
                  className="group rounded-xl border border-blue-100 bg-background hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200/60 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-blue-600 ml-1" />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground group-hover:text-blue-700 transition-colors line-clamp-1">
                        {video.title}
                      </h3>
                      <Badge className={`${getLevelColor(video.level)} text-xs shrink-0`}>
                        {video.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Academy;

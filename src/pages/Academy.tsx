import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ArrowLeft, Clock, Play, ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Academy</h1>
          <p className="text-muted-foreground">Learn to write effective queries for insurance AI agents</p>
        </div>

        {/* External Courses Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
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
                  className="group rounded-xl border border-border bg-background hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-card/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ExternalLink className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getProviderColor(course.provider)} text-xs`}>
                        {course.provider}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="w-5 h-5" />
              Training Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleVideos.map((video) => (
                <div
                  key={video.id}
                  className="group rounded-xl border border-border bg-background hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-card/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary ml-1" />
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
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

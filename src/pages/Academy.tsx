import { Link } from 'react-router-dom';
import { useState } from 'react';
import EnterpriseHeader from '@/components/EnterpriseHeader';
import { Clock, Play, ExternalLink, GraduationCap, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sampleVideos, externalCourses } from '@/data/sampleData';
import claudeLogo from '../assets/claude.png';

const Academy = () => {
  const [selectedVideo, setSelectedVideo] = useState<typeof sampleVideos[0] | null>(null);
  const coactionVideos = sampleVideos.filter((video) => video.id === '1');
  
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
      case 'Anthropic':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderProviderLogo = (provider: string) => {
    switch (provider) {
      case 'Microsoft Learn':
        return (
          <svg
            className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="10" width="30" height="30" fill="#F25022" />
            <rect x="50" y="10" width="30" height="30" fill="#7FBA00" />
            <rect x="10" y="50" width="30" height="30" fill="#00A4EF" />
            <rect x="50" y="50" width="30" height="30" fill="#FFB900" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-20 h-20 group-hover:scale-110 transition-transform duration-300"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="10" width="80" height="80" fill="#E5E7EB" rx="8" />
            <text x="50" y="60" textAnchor="middle" fontSize="24" fill="#6B7280" fontWeight="bold">
              ?
            </text>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EnterpriseHeader
        portalName="Enterprise AI Portal"
        color="bg-yellow-100"
        pageTitle="AI Academy"
        pageDescription="Learn to write effective queries for insurance AI agents"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academy' },
        ]}
        icon={<GraduationCap className="w-5 h-5 text-black" />}
      />

      <main className="w-full max-w-[1900px] mx-auto px-6 xl:px-12 py-8">

        {/* Available Courses Section */}
        <Card className="mb-8 border-yellow-200/70 bg-stone-50/65 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-black" />
              </div>
              Available Courses
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
                  className="group rounded-xl border border-yellow-200/80 bg-stone-100/80 hover:border-yellow-300 hover:shadow-sm transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      {course.provider === 'Anthropic' ? (
                        <img
                          src={claudeLogo}
                          alt="Claude"
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        renderProviderLogo(course.provider)
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <ExternalLink className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getProviderColor(course.provider)} text-xs`}>
                        {course.provider}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground group-hover:text-amber-700 transition-colors line-clamp-2">
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
        <Card className="border-yellow-200/70 bg-stone-50/65 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 flex items-center justify-center">
                <Play className="w-5 h-5 text-black" />
              </div>
              Training Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coactionVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group rounded-xl border border-yellow-200/80 bg-stone-100/80 hover:border-yellow-300 hover:shadow-sm transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video bg-stone-200/60 flex items-center justify-center overflow-hidden">
                    {video.videoPath ? (
                      <>
                        <video
                          src={video.videoPath}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <Play className="w-6 h-6 text-black ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                            <Play className="w-6 h-6 text-black ml-1" />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-foreground/80 text-background text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground group-hover:text-amber-700 transition-colors line-clamp-1">
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

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-4xl rounded-xl bg-slate-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black aspect-video flex items-center justify-center">
              {selectedVideo.videoPath ? (
                <video
                  src={selectedVideo.videoPath}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Video player would display here</p>
                </div>
              )}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-900">
              <h2 className="text-xl font-bold text-white mb-2">{selectedVideo.title}</h2>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${getLevelColor(selectedVideo.level)}`}>
                  {selectedVideo.level}
                </Badge>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedVideo.duration}
                </span>
                <span className="text-slate-400 text-sm">{selectedVideo.category}</span>
              </div>
              <p className="text-slate-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academy;

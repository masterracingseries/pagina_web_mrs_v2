
import React from 'react';
import { MEDIA_ITEMS } from '../constants';
import { Play, Image as ImageIcon } from 'lucide-react';

const Multimedia: React.FC = () => {
  return (
    <section id="media" className="py-20 bg-mrs-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
             <div>
                <span className="text-mrs-red font-bold tracking-widest text-sm uppercase">Gallery</span>
                <h2 className="text-4xl md:text-5xl font-display text-white italic">MULTIMEDIA</h2>
             </div>
             <div className="hidden md:block">
                <a href="https://youtube.com" target="_blank" className="text-white hover:text-mrs-red transition-colors text-sm font-bold uppercase flex items-center gap-2">
                    Ver Canal Completo <Play size={16} />
                </a>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEDIA_ITEMS.map((item, index) => (
                <div 
                    key={item.id} 
                    className={`relative group rounded-lg overflow-hidden border border-gray-800 bg-gray-900 ${
                        // Make first item large if it's a video
                        index === 0 ? 'md:col-span-2 md:row-span-2 aspect-video md:aspect-auto' : 'aspect-video'
                    }`}
                >
                    {item.type === 'YOUTUBE' || item.type === 'TWITCH' ? (
                        <div className="w-full h-full">
                             <iframe 
                                src={item.url} 
                                title={item.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                             <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <ImageIcon className="text-white" size={32} />
                             </div>
                             <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                                 <p className="text-white text-sm font-bold truncate">{item.title}</p>
                             </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Multimedia;

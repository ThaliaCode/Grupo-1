import { useState } from 'react';

function VideoPlayer({ embedUrl, thumbnail }) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (!embedUrl) return null;

    return (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group">
            {!isPlaying ? (
                <>
                    {/* Thumbnail con overlay */}
                    <img
                        src={thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                    {/* Botón Play */}
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label="Play video"
                    >
                        <div className="w-20 h-20 rounded-full bg-brand-primary/90 hover:bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30 transition-all hover:scale-110">
                            <span className="font-icons text-white text-4xl ml-1">play_arrow</span>
                        </div>
                    </button>

                    {/* Label */}
                    <div className="absolute bottom-4 left-4">
                        <span className="text-white text-sm font-medium flex items-center gap-2">
                            <span className="font-icons text-brand-primary">play_circle</span>
                            Watch tutorial
                        </span>
                    </div>
                </>
            ) : (
                /* YouTube Embed */
                <iframe
                    src={`${embedUrl}?autoplay=1`}
                    title="Recipe video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
}

export default VideoPlayer;
"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 40;

export default function KeyboardExplosion() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Используем window scroll вместо container scroll
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    const frameNumber = (i + 1).toString().padStart(3, "0");
                    const filename = `ezgif-frame-${frameNumber}.jpg`;
                    img.src = `/frames/${filename}`;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error(`Error loading: ${filename}`);
                        resolve();
                    };
                    loadedImages[i] = img;
                });
                promises.push(promise);
            }

            let completed = 0;
            promises.forEach(p => p.then(() => {
                completed++;
                setLoadingProgress((completed / FRAME_COUNT) * 100);
            }));

            await Promise.all(promises);
            setImages(loadedImages);
            setImagesLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context || !imagesLoaded || images.length === 0) return;

        const imageIndex = Math.min(Math.max(Math.round(index), 0), FRAME_COUNT - 1);
        const img = images[imageIndex];

        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgAspect;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Рассчитываем frame index на основе scroll и позиции контейнера
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!imagesLoaded || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const containerHeight = container.offsetHeight;
        const viewportHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - viewportHeight;

        // Рассчитываем позицию скролла относительно контейнера
        const scrollTop = window.scrollY;
        const containerTop = scrollTop + rect.top;
        const containerBottom = containerTop + containerHeight;

        // Прогресс скролла внутри контейнера
        const progress = Math.max(0, Math.min(1,
            (scrollTop - containerTop) / (containerHeight - viewportHeight)
        ));

        const frameIndex = Math.round(progress * (FRAME_COUNT - 1));
        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    useEffect(() => {
        if (imagesLoaded) renderFrame(0);
    }, [imagesLoaded]);

    if (!imagesLoaded) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white">
                <p className="font-sans text-xl">LOADING... {Math.round(loadingProgress)}%</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            </div>
        </div>
    );
}

import React, { useEffect, useRef } from 'react';
import lottie from "lottie-web"

export default function CompletionAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!containerRef.current) return;

        const animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "https://lottie.host/d786fda8-5f6f-4c82-b65a-96abe94b329a/7OEQBGKSQY.json",
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        });

        return() => {
            animation.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%"
            }} 
        />
    );
}

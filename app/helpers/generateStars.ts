import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

interface MousePosition {
    x: number,
    y: number,
}

interface DrawStarProps {
    x: number,
    y: number,
    r: number,
    mousePosition: MousePosition,
    starsLength: number,
    context: CanvasRenderingContext2D,
    scale: number,
    opacity: number,
    isShooting: boolean,
}

let cometInterval: NodeJS.Timeout | null = null;

const drawStar = ({
    x,
    y,
    r,
    opacity,
    scale,
    context,
    isShooting,
    mousePosition,
    starsLength,
}: DrawStarProps) => {
    const distance = Math.abs(x - mousePosition.x) + Math.abs(y - mousePosition.y);

    if (!isShooting) {
        context.fillStyle = `hsla(0, 0%, 100%, ${Math.max(0.4, 1 - distance / 500)})`;
    }

    if (isShooting) {
        context.fillStyle = `hsla(0, 0%, 100%, ${opacity})`;
    }

    context.beginPath();

    const radius = r * r * Math.max(1 / (starsLength - 1), 0.1) * scale;

    if (distance < 100) {
        context.arc(x, y, radius * 1.2, 0, 2 * Math.PI);
    }

    if (distance >= 100) {
        context.arc(x, y, radius, 0, 2 * Math.PI);
    }

    context.fill();
};

interface Star {
    x: number,
    y: number,
    originalX: number,
    originalY: number,
    opacity: number,
    scale: number,
    r: number,
    isShooting: boolean,
}

interface ReDrawProps {
    context: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    stars: Star[],
    mousePosition: MousePosition,
}

const redraw = ({
    context,
    cw,
    ch,
    stars,
    mousePosition,
}: ReDrawProps) => {
    context.clearRect(0, 0, cw, ch);

    const starsLength = stars.length;

    stars.forEach(dot => drawStar({
        x: dot.x,
        y: dot.y,
        r: dot.r,
        context,
        mousePosition,
        starsLength,
        isShooting: dot.isShooting,
        scale: dot.scale,
        opacity: dot.opacity,
    }));
};

const getRandomStarPosition = (cw: number, ch: number) => {
    const x = gsap.utils.random(0, cw);
    const y = gsap.utils.random(0, ch);
    const bottomHeight = ch * 0.8;
    const topHeight = ch * 0.23;
    const rightWidth = cw * 0.6;
    const leftWidth = cw * 0.4;

    if ((x < leftWidth || x > rightWidth) && (y < topHeight || y > bottomHeight)) {
        return {x, y};
    }

    if (x > leftWidth && x < rightWidth && (y < topHeight || y > bottomHeight)) {
        return {x, y};
    }

    if ((x < leftWidth || x > rightWidth) && y > topHeight && y < bottomHeight) {
        return {x, y};
    }

    return getRandomStarPosition(cw, ch);
};

const stopCometAnimation = () => {
    if (cometInterval !== null) {
        clearInterval(cometInterval);
        cometInterval = null;
    }
};

const handleVisibilityChange = (stars: Star[], mouseposition: MousePosition, isMobile: boolean) => {
    if (document.hidden || !document.hasFocus()) {
        // Pokud stránka není viditelná nebo ztratí focus, zastavíme animaci
        stopCometAnimation();
    } else {
        // Pokud se stránka stane viditelnou nebo získá focus, znovu spustíme animaci
        startCometAnimation(stars, mouseposition, isMobile);
    }
};

const animateComet = (star: Star, isMobile: boolean) => {
    const cometTimeline = gsap.timeline({
        onComplete: () => {
            gsap.to(star, {
                duration: 0,
                delay: 5,
                x: star.originalX,
                y: star.originalY,
                onComplete: () => {
                    gsap.to(star, {
                        duration: 0.3,
                        isShooting: false,
                        opacity: 0.4,
                        ease: 'power1.inOut',
                        scale: 1,
                    });
                },
            });
        },
    });

    gsap.set(star, {isShooting: true});

    const xShift = isMobile ? -100 : -500;
    const yShift = isMobile ? 600 : 400;

    cometTimeline
        .to(star, {
            duration: 2,
            x: star.x + xShift,
            y: star.y + yShift,
            opacity: 0.3,
            ease: 'power1.inOut',
            onUpdate: () => {
                star.opacity = Math.max(0.2, star.opacity - 0.015);
            },
        })
        .to(star, {
            duration: 0.3,
            opacity: 0,
            ease: 'power2.out',
        }, '<1.7');
};

// Funkce pro nalezení nejbližší hvězdy k pozici myši
const getRandomStarNearMouse = (stars: Star[], mousePosition: MousePosition, radius: number = 150) => {
    // Najdeme všechny hvězdy, které jsou v daném radiusu od pozice myši
    const nearbyStars = stars.filter(star => {
        const distance = Math.hypot(star.x - mousePosition.x, star.y - mousePosition.y);

        return distance <= radius;
    });

    // Pokud máme nějaké hvězdy v okolí, vybereme jednu náhodně
    if (nearbyStars.length > 0) {
        const randomIndex = Math.floor(Math.random() * nearbyStars.length);

        return nearbyStars[randomIndex];
    }

    // Pokud nejsou žádné hvězdy v radiusu, vybereme tu nejbližší
    return getRandomStarNearMouse(stars, mousePosition);
};

const startCometAnimation = (stars: Star[], mousePosition: MousePosition, isMobile: boolean) => {
    cometInterval = setInterval(() => {
        const star = getRandomStarNearMouse(stars, mousePosition);

        animateComet(star, isMobile);
    }, 8000);
};

const handleStarClick = (star: Star, isMobile: boolean) => {
    animateComet(star, isMobile);
};

const applyParallaxEffect = (stars: Star[], canvasHeight: number) => {
    stars.forEach(star => {
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top', // Od začátku stránky
            end: 'bottom top', // Konec scrollu (100vh)
            scrub: true, // Plynulé posouvání
            onUpdate: self => {
                const progress = self.progress; // Hodnota scrollu (0 až 1)

                star.y = star.originalY + progress * canvasHeight * (star.r / 4); // Parallax posunutí na základě velikosti hvězdy
            },
        });
    });
};

const generateStarsCanvas = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    gsap.registerPlugin(ScrollTrigger);

    if (context === null) {
        return;
    }

    let cw = canvas.width = innerWidth;
    let ch = canvas.height = innerHeight;
    const isMobile = window.innerWidth < 768;
    let stars: Star[];
    const duration = 25;
    const mousePosition = {x: cw / 2, y: ch};

    canvas.onpointermove = e => gsap.to(mousePosition, {x: e.offsetX, y: e.offsetY});
    canvas.onclick = e => gsap.to(mousePosition, {x: e.offsetX, y: e.offsetY});

    const generateStars = (curentCw: number, currentCh: number) => {
        const isMobile = window.innerWidth < 768;
        const starCount = isMobile ? 200 : 400;
        const minStarSize = isMobile ? 1 : 1.5;
        const maxStarSize = isMobile ? 3 : 4.5;

        const newStars = Array(starCount) as Star[];

        for (let i = 0; i < newStars.length; i++) {
            const {x, y} = getRandomStarPosition(curentCw, currentCh);

            newStars[i] = {
                x,
                y,
                originalX: x,
                originalY: y,
                r: gsap.utils.random(minStarSize, maxStarSize, 0.1),
                isShooting: false,
                opacity: 1,
                scale: 1,
            };
        }

        return newStars;
    };

    stars = generateStars(cw, ch);

    canvas.onclick = e => {
        const x = e.offsetX;
        const y = e.offsetY;
        const clickedStar = stars.find(star => Math.hypot(star.x - x, star.y - y) < star.r * 4);

        if (clickedStar) {
            handleStarClick(clickedStar, isMobile);
        }
    };

    gsap.timeline({
        onUpdate: () => redraw({
            context,
            cw,
            ch,
            stars,
            mousePosition,
        }),
    })
        .from(stars, {
            duration: duration,
            ease: 'none',
            repeatRefresh: true,
            stagger: {
                from: 'random',
                amount: duration,
                repeat: -1,
            },
        })
        .seek(duration);

    applyParallaxEffect(stars, ch);

    document.addEventListener('visibilitychange', () => handleVisibilityChange(stars, mousePosition, isMobile));
    window.addEventListener('blur', () => handleVisibilityChange(stars, mousePosition, isMobile));
    window.addEventListener('focus', () => handleVisibilityChange(stars, mousePosition, isMobile));

    window.addEventListener('resize', () => {
        cw = canvas.width = innerWidth;
        ch = canvas.height = innerHeight;
        stars = generateStars(cw, ch);
    });
};

export default generateStarsCanvas;

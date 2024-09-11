import {gsap} from 'gsap';

interface DrawStarProps {
    x: number,
    y: number,
    r: number,
    mousePosition: {x: number, y: number},
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
    mousePosition: {x: number, y: number},
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

const handleVisibilityChange = (stars: Star[]) => {
    if (document.hidden || !document.hasFocus()) {
        // Pokud stránka není viditelná nebo ztratí focus, zastavíme animaci
        stopCometAnimation();
    } else {
        // Pokud se stránka stane viditelnou nebo získá focus, znovu spustíme animaci
        startCometAnimation(stars);
    }
};

const animateComet = (star: Star) => {
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

    cometTimeline
        .to(star, {
            duration: 2,
            x: star.x - 500,
            y: star.y + 400,
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

const startCometAnimation = (stars: Star[]) => {
    const randomStar = () => stars[Math.floor(Math.random() * stars.length)];

    cometInterval = setInterval(() => {
        const star = randomStar();

        animateComet(star);
    }, 5000);
};

const handleStarClick = (star: Star) => {
    animateComet(star);
};

const generateStars = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if (context === null) {
        return;
    }

    const cw = canvas.width = innerWidth;
    const ch = canvas.height = innerHeight;
    let stars = Array(400) as Star[];
    const dur = 25;
    const mousePosition = {x: cw / 2, y: ch};

    canvas.onpointermove = e => gsap.to(mousePosition, {x: e.offsetX, y: e.offsetY});

    const generateStars = (curentCw: number, currentCh: number) => {
        stars = Array(400) as Star[];

        for (let i = 0; i < stars.length; i++) {
            const {x, y} = getRandomStarPosition(curentCw, currentCh);

            stars[i] = {
                x,
                y,
                originalX: x,
                originalY: y,
                r: gsap.utils.random(1.5, 4.5, 0.1),
                isShooting: false,
                opacity: 1,
                scale: 1,
            };
        }
    };

    generateStars(cw, ch);

    canvas.onclick = e => {
        const x = e.offsetX;
        const y = e.offsetY;
        const clickedStar = stars.find(star => Math.hypot(star.x - x, star.y - y) < star.r * 4);

        if (clickedStar) {
            handleStarClick(clickedStar);
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
            duration: dur,
            ease: 'none',
            repeatRefresh: true,
            stagger: {
                from: 'random',
                amount: dur,
                repeat: -1,
            },
        })
        .seek(dur);

    startCometAnimation(stars);

    document.addEventListener('visibilitychange', () => handleVisibilityChange(stars));
    window.addEventListener('blur', () => handleVisibilityChange(stars));
    window.addEventListener('focus', () => handleVisibilityChange(stars));
    document.addEventListener('resize', () => {
        const cw = canvas.width = innerWidth;
        const ch = canvas.height = innerHeight;

        mousePosition.x = cw / 2;
        mousePosition.y = ch;

        generateStars(cw, ch);

        redraw({
            context,
            cw,
            ch,
            stars,
            mousePosition,
        });
    });
};

export default generateStars;

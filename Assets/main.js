document.addEventListener('DOMContentLoaded', () => {
    console.log("Script carregado com sucesso!"); // Verifique se isso aparece no console (F12)

    /* =========================================
       1. CONFIGURAÇÃO DO SCROLL SUAVE (LENIS)
       ========================================= */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothTouch: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Suporte a links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    lenis.scrollTo(targetId);
                }
            });
        });
    }

    /* =========================================
       2. LÓGICA DO CARROSSEL 3D
       ========================================= */
    const carouselContainers = document.querySelectorAll('.carousel-3d-container');

    carouselContainers.forEach(container => {
        const track = container.querySelector('.carousel-3d-track');
        const slides = Array.from(track.querySelectorAll('.carousel-3d-slide'));
        
        // CORREÇÃO: Selecionando por classe em vez de ID
        const nextButton = container.querySelector('.next-btn');
        const prevButton = container.querySelector('.prev-btn');

        if (slides.length === 0) return;

        let currentIndex = 0;
        const slideCount = slides.length;
        let autoplayInterval;

        const updateCarousel = () => {
            slides.forEach(slide => {
                slide.classList.remove('active', 'prev', 'next');
                slide.style.zIndex = "0";
                slide.style.opacity = "0"; // Força invisibilidade nos inativos
            });

            const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
            const nextIndex = (currentIndex + 1) % slideCount;

            // Ativo
            slides[currentIndex].classList.add('active');
            slides[currentIndex].style.zIndex = "10";
            slides[currentIndex].style.opacity = "1";

            // Anterior
            slides[prevIndex].classList.add('prev');
            slides[prevIndex].style.zIndex = "5";
            slides[prevIndex].style.opacity = "0.6";

            // Próximo
            slides[nextIndex].classList.add('next');
            slides[nextIndex].style.zIndex = "5";
            slides[nextIndex].style.opacity = "0.6";
        };

        const goToNext = () => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        };

        const goToPrev = () => {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(goToNext, 4000);
        };

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault(); // Evita scroll estranho
                goToNext();
                startAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                goToPrev();
                startAutoplay();
            });
        }

        // Swipe para Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) goToNext();
            if (touchEndX - touchStartX > 50) goToPrev();
            startAutoplay();
        });

        // Inicializa
        updateCarousel();
        startAutoplay();
    });
});
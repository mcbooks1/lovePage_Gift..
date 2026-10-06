(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Golden Particles ---------- */
  const cv = $('#fx');
  const cx = cv.getContext('2d');

  let W, H, P = [], boost = 1;

  const mk = () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.6 + 0.3,
    v: Math.random() * 0.3 + 0.08,
    a: Math.random() * 6.28
  });

  function size() {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;

    P = Array.from(
      { length: Math.min(70, (W / 18) | 0) },
      mk
    );
  }

  function particleLoop() {
    cx.clearRect(0, 0, W, H);

    P.forEach(p => {
      p.y -= p.v * boost;
      p.a += 0.02;

      if (p.y < -4) {
        p.y = H + 4;
        p.x = Math.random() * W;
      }

      cx.beginPath();

      cx.arc(
        p.x,
        p.y,
        p.r * (boost > 1 ? 1.4 : 1),
        0,
        6.28
      );

      cx.fillStyle =
        `rgba(216,184,120,${0.2 + Math.sin(p.a) * 0.15})`;

      cx.fill();
    });

    requestAnimationFrame(particleLoop);
  }

  addEventListener('resize', size);

  size();
  particleLoop();


  /* ---------- Scroll Reveal ---------- */

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );


  /* ---------- Opening Chime ---------- */

  function chime() {
    try {
      const AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;

      const audioContext = new AudioCtx();

      [523.25, 783.99, 1046.5].forEach((frequency, i) => {

        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        const time =
          audioContext.currentTime + i * 0.18;

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0, time);

        gain.gain.linearRampToValueAtTime(
          0.06,
          time + 0.05
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          time + 1.6
        );

        oscillator
          .connect(gain)
          .connect(audioContext.destination);

        oscillator.start(time);
        oscillator.stop(time + 1.7);
      });

    } catch (error) {
      console.log('Chime unavailable');
    }
  }


  /* ---------- Open Gift ---------- */

  $('#openBtn').addEventListener('click', () => {

    chime();

    $('#main').classList.remove('hidden');

    $('#intro').classList.add('out');

    setTimeout(() => {

      document.body.classList.remove('locked');

      $('#music').classList.add('show');

    }, 900);

    $$('.rv').forEach(element => {
      io.observe(element);
    });

  });


  /* ---------- Lightbox Gallery ---------- */

  const items = $$('.g');
  const lb = $('#lb');

  let cur = 0;

  function show(index) {

    cur =
      (index + items.length) %
      items.length;

    const image =
      $('img', items[cur]);

    $('#lbI').src = image.src;

    $('#lbI').alt = image.alt;

    $('#lbC').textContent =
      items[cur].dataset.cap || '';
  }


  function openLightbox(index) {

    show(index);

    lb.classList.add('open');

  }


  function closeLightbox() {

    lb.classList.remove('open');

  }


  items.forEach((element, index) => {

    element.addEventListener('click', () => {
      openLightbox(index);
    });

    element.addEventListener('keydown', event => {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();

        openLightbox(index);
      }

    });

  });


  /* Lightbox Buttons */

  $('#lbX').onclick = closeLightbox;

  $('#lbP').onclick = () => {
    show(cur - 1);
  };

  $('#lbN').onclick = () => {
    show(cur + 1);
  };


  /* Close When Clicking Outside */

  lb.addEventListener('click', event => {

    if (event.target === lb) {
      closeLightbox();
    }

  });


  /* Keyboard Controls */

  addEventListener('keydown', event => {

    if (!lb.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      show(cur - 1);
    }

    if (event.key === 'ArrowRight') {
      show(cur + 1);
    }

  });


  /* ---------- Mobile Swipe ---------- */

  let sx = 0;

  lb.addEventListener(
    'touchstart',
    event => {

      sx = event.touches[0].clientX;

    },
    {
      passive: true
    }
  );


  lb.addEventListener(
    'touchend',
    event => {

      const distance =
        event.changedTouches[0].clientX - sx;

      if (Math.abs(distance) > 50) {

        show(
          cur + (distance < 0 ? 1 : -1)
        );

      }

    }
  );


  /* ---------- Love Letter ---------- */

  $('#letterBtn').addEventListener('click', event => {

    event.target.style.display = 'none';

    $('#env').classList.add('open');

    setTimeout(() => {

      $('#env').classList.add('gone');

      $('#letter').classList.remove('hidden');

      $$('.line').forEach((line, index) => {

        setTimeout(() => {

          line.classList.add('in');

        }, 400 + index * 1300);

      });

    }, 1300);

  });


  /* ---------- Featured Image Parallax ---------- */

  const feat = $('#feat');
  const pimg = $('#pimg');

  let tick = false;

  addEventListener(
    'scroll',
    () => {

      if (tick) return;

      tick = true;

      requestAnimationFrame(() => {

        const rect =
          feat.getBoundingClientRect();

        if (
          rect.bottom > 0 &&
          rect.top < innerHeight
        ) {

          pimg.style.transform =
            `translateY(${(rect.top - innerHeight / 2) * -0.12}px)`;

        }

        tick = false;

      });

    },
    {
      passive: true
    }
  );


  /* ---------- Music ---------- */

  const musicButton = $('#music');
  const audio = $('#audio');

  musicButton.addEventListener('click', () => {

    if (audio.paused) {

      audio.play()
        .then(() => {

          musicButton.classList.add('playing');

          musicButton.setAttribute(
            'aria-pressed',
            'true'
          );

          $('#mState').textContent = 'PAUSE';

        })
        .catch(() => {

          alert(
            'Music file not found: audio/our-song.mp3'
          );

        });

    } else {

      audio.pause();

      musicButton.classList.remove('playing');

      musicButton.setAttribute(
        'aria-pressed',
        'false'
      );

      $('#mState').textContent = 'PLAY';

    }

  });


  /* ---------- Final Surprise ---------- */

  $('#surpriseBtn').addEventListener(
    'click',
    () => {

      const veil = $('#veil');
      const finalSection = $('#final');

      veil.classList.add('on');

      boost = 3;


      /* Extra Golden Particles */

      for (let i = 0; i < 40; i++) {
        P.push(mk());
      }


      /* Floating Hearts */

      for (let i = 0; i < 22; i++) {

        setTimeout(() => {

          const heart =
            document.createElement('span');

          heart.className = 'fh';

          heart.textContent = '❤';

          heart.style.left =
            Math.random() * 100 + 'vw';

          heart.style.fontSize =
            10 + Math.random() * 16 + 'px';

          heart.style.setProperty(
            '--dx',
            Math.random() * 120 - 60 + 'px'
          );

          heart.style.animationDuration =
            7 + Math.random() * 5 + 's';

          document.body.appendChild(heart);

          setTimeout(() => {
            heart.remove();
          }, 12500);

        }, i * 220);

      }


      /* Show Final Section */

      setTimeout(() => {

        finalSection.classList.add('done');

        finalSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        requestAnimationFrame(() => {

          requestAnimationFrame(() => {

            finalSection.classList.add('show');

            veil.classList.remove('on');

          });

        });

      }, 1300);


      /* Return Particle Speed */

      setTimeout(() => {

        boost = 1.4;

      }, 9000);

    }
  );


})();